import { Extension, ReaderContext, WriterContext } from "@gltf-transform/core";

import { EXTENSION_NAME } from "./constants";
import {
  NodeShapeJson,
  nodeShapeSchema,
  ShapeExtensionJson,
  shapeExtensionSchema,
  ShapeJson,
} from "./schemas";
import { Shape } from "./Shape";

/**
 * Implementation of the {@link https://github.com/omigroup/gltf-extensions/tree/main/extensions/2.0/OMI_physics_shape OMI_physics_shape} extension.
 */
export class OMIPhysicsShape extends Extension {
  static override readonly EXTENSION_NAME = EXTENSION_NAME;
  override readonly extensionName = EXTENSION_NAME;

  createShape(): Shape {
    return new Shape(this.document.getGraph());
  }

  read(context: ReaderContext) {
    if (
      !context.jsonDoc.json.extensions ||
      !context.jsonDoc.json.extensions[this.extensionName]
    )
      return this;

    const parsedRootJson = shapeExtensionSchema.safeParse(
      context.jsonDoc.json.extensions[this.extensionName]
    );

    if (!parsedRootJson.success) {
      console.warn(parsedRootJson.error);
      return this;
    }

    const rootJson = parsedRootJson.data;

    // Create shapes
    const shapes = rootJson.shapes.map((shapeJson) => {
      const shape = this.createShape();
      shape.setType(shapeJson.type);

      if (shapeJson.size !== undefined) {
        shape.setSize([
          shapeJson.size[0] ?? 0,
          shapeJson.size[1] ?? 0,
          shapeJson.size[2] ?? 0,
        ]);
      }

      if (shapeJson.radius !== undefined) {
        shape.setRadius(shapeJson.radius);
      }

      if (shapeJson.height !== undefined) {
        shape.setHeight(shapeJson.height);
      }

      if (shapeJson.mesh !== undefined) {
        const mesh = context.meshes[shapeJson.mesh];
        if (mesh) {
          shape.setMesh(mesh);
        }
      }

      return shape;
    });

    // Add shapes to nodes
    const nodeJsons = context.jsonDoc.json.nodes ?? [];

    nodeJsons.forEach((nodeJson, nodeIndex) => {
      if (!nodeJson.extensions || !nodeJson.extensions[this.extensionName])
        return;

      const parsedShape = nodeShapeSchema.safeParse(
        nodeJson.extensions[this.extensionName]
      );

      if (!parsedShape.success) {
        console.warn(parsedShape.error);
        return;
      }

      const node = context.nodes[nodeIndex];
      if (!node) return;

      const shape = shapes[parsedShape.data.shape];
      if (!shape) return;

      node.setExtension(this.extensionName, shape);
    });

    return this;
  }

  write(context: WriterContext) {
    if (this.properties.size === 0) return this;

    // Create shape definitions
    const shapeJsons = [];
    const shapeIndexMap = new Map<Shape, number>();

    for (const property of this.properties) {
      if (property instanceof Shape) {
        const type = property.getType();

        const shapeJson: ShapeJson = {
          type,
        };

        switch (type) {
          case "box": {
            const size = property.getSize();
            if (!size) throw new Error("Size not set");

            shapeJson.size = size;
            break;
          }

          case "sphere": {
            const radius = property.getRadius();
            if (radius === null) throw new Error("Radius not set");

            shapeJson.radius = radius;
            break;
          }

          case "capsule":
          case "cylinder": {
            const radius = property.getRadius();
            if (radius === null) throw new Error("Radius not set");

            const height = property.getHeight();
            if (height === null) throw new Error("Height not set");

            shapeJson.radius = radius;
            shapeJson.height = height;
            break;
          }

          case "convex":
          case "trimesh": {
            const mesh = property.getMesh();
            if (!mesh) break;

            const meshIndex = context.meshIndexMap.get(mesh);
            if (meshIndex === undefined) throw new Error("Mesh not found");

            shapeJson.mesh = meshIndex;
            break;
          }
        }

        shapeJsons.push(shapeJson);
        shapeIndexMap.set(property, shapeJsons.length - 1);
      }
    }

    // Add shape references to nodes
    this.document
      .getRoot()
      .listNodes()
      .forEach((node) => {
        const shape = node.getExtension<Shape>(Shape.EXTENSION_NAME);
        if (!shape) return;

        const nodeIndex = context.nodeIndexMap.get(node);
        if (nodeIndex === undefined) throw new Error("Node index not found");

        const nodes = context.jsonDoc.json.nodes;
        if (!nodes) throw new Error("Nodes not found");

        const nodeJson = nodes[nodeIndex];
        if (!nodeJson) throw new Error("Node json not found");

        const shapeIndex = shapeIndexMap.get(shape);
        if (shapeIndex === undefined) throw new Error("Shape index not found");

        nodeJson.extensions ??= {};

        const nodeShapeJson: NodeShapeJson = {
          shape: shapeIndex,
        };

        nodeJson.extensions[this.extensionName] = nodeShapeJson;
      });

    // Add extension definition to root
    if (shapeJsons.length > 0) {
      const rootJson: ShapeExtensionJson = { shapes: shapeJsons };

      if (!context.jsonDoc.json.extensions) {
        context.jsonDoc.json.extensions = {};
      }

      context.jsonDoc.json.extensions[this.extensionName] = rootJson;
    }

    return this;
  }
}
