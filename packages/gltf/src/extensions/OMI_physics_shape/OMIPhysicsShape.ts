import { Extension, ReaderContext, WriterContext } from "@gltf-transform/core";

import { EXTENSION_NAME } from "./constants";
import {
  ColliderDef,
  ColliderExtensionDef,
  colliderExtensionSchema,
  NodeColliderDef,
  nodeColliderSchema,
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

    const parsedRootDef = colliderExtensionSchema.safeParse(
      context.jsonDoc.json.extensions[this.extensionName],
    );

    if (!parsedRootDef.success) {
      console.warn(parsedRootDef.error);
      return this;
    }

    const rootDef = parsedRootDef.data;

    // Create colliders
    const colliders = rootDef.shapes.map((colliderDef) => {
      const collider = this.createShape();
      collider.setType(colliderDef.type);

      if (colliderDef.size !== undefined)
        collider.setSize([
          colliderDef.size[0] ?? 0,
          colliderDef.size[1] ?? 0,
          colliderDef.size[2] ?? 0,
        ]);
      if (colliderDef.radius !== undefined)
        collider.setRadius(colliderDef.radius);
      if (colliderDef.height !== undefined)
        collider.setHeight(colliderDef.height);
      if (colliderDef.mesh !== undefined) {
        const mesh = context.meshes[colliderDef.mesh];
        if (mesh) collider.setMesh(mesh);
      }

      return collider;
    });

    // Add colliders to nodes
    const nodeDefs = context.jsonDoc.json.nodes ?? [];

    nodeDefs.forEach((nodeDef, nodeIndex) => {
      if (!nodeDef.extensions || !nodeDef.extensions[this.extensionName])
        return;

      const parsedColliderNodeDef = nodeColliderSchema.safeParse(
        nodeDef.extensions[this.extensionName],
      );

      if (!parsedColliderNodeDef.success) {
        console.warn(parsedColliderNodeDef.error);
        return;
      }

      const colliderNodeDef = parsedColliderNodeDef.data;

      const node = context.nodes[nodeIndex];
      if (!node) return;

      const collider = colliders[colliderNodeDef.shape];
      if (!collider) return;

      node.setExtension(this.extensionName, collider);
    });

    return this;
  }

  write(context: WriterContext) {
    const jsonDoc = context.jsonDoc;

    if (this.properties.size === 0) return this;

    // Create collider definitions
    const colliderDefs = [];
    const colliderIndexMap = new Map<Shape, number>();

    for (const property of this.properties) {
      if (property instanceof Shape) {
        const colliderDef: ColliderDef = {
          type: property.getType(),
        };

        switch (property.getType()) {
          case "box": {
            const size = property.getSize();
            if (!size) throw new Error("Size not set");

            colliderDef.size = size;
            break;
          }

          case "sphere": {
            const radius = property.getRadius();
            if (radius === null) throw new Error("Radius not set");

            colliderDef.radius = radius;
            break;
          }

          case "capsule":
          case "cylinder": {
            const radius = property.getRadius();
            if (radius === null) throw new Error("Radius not set");

            const height = property.getHeight();
            if (height === null) throw new Error("Height not set");

            colliderDef.radius = radius;
            colliderDef.height = height;
            break;
          }

          case "convex":
          case "trimesh": {
            const mesh = property.getMesh();
            if (!mesh) break;

            const meshIndex = context.meshIndexMap.get(mesh);
            if (meshIndex === undefined) throw new Error("Mesh not found");

            colliderDef.mesh = meshIndex;
            break;
          }
        }

        colliderDefs.push(colliderDef);
        colliderIndexMap.set(property, colliderDefs.length - 1);
      }
    }

    // Add collider references to nodes
    this.document
      .getRoot()
      .listNodes()
      .forEach((node) => {
        const collider = node.getExtension<Shape>(Shape.EXTENSION_NAME);
        if (!collider) return;

        const nodeIndex = context.nodeIndexMap.get(node);
        if (nodeIndex === undefined) throw new Error("Node index not found");

        const nodes = jsonDoc.json.nodes;
        if (!nodes) throw new Error("Nodes not found");

        const nodeDef = nodes[nodeIndex];
        if (!nodeDef) throw new Error("Node def not found");

        const colliderIndex = colliderIndexMap.get(collider);
        if (colliderIndex === undefined)
          throw new Error("Collider index not found");

        nodeDef.extensions ??= {};

        const colliderDef: NodeColliderDef = { shape: colliderIndex };
        nodeDef.extensions[this.extensionName] = colliderDef;
      });

    // Add extension definition to root
    if (colliderDefs.length > 0) {
      const rootDef: ColliderExtensionDef = { shapes: colliderDefs };

      if (!jsonDoc.json.extensions) jsonDoc.json.extensions = {};
      jsonDoc.json.extensions[this.extensionName] = rootDef;
    }

    return this;
  }
}
