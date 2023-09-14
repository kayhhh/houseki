import { Extension, ReaderContext, WriterContext } from "@gltf-transform/core";

import { EXTENSION_NAME } from "./constants";
import { PhysicsBody } from "./PhysicsBody";
import { NodePhysicsBody, nodePhysicsBodySchema } from "./schemas";

/**
 * Implementation of the {@link https://github.com/omigroup/gltf-extensions/tree/main/extensions/2.0/OMI_physics_body OMI_physics_body} extension.
 */
export class OMIPhysicsBody extends Extension {
  static override readonly EXTENSION_NAME = EXTENSION_NAME;
  override readonly extensionName = EXTENSION_NAME;

  createPhysicsBody(): PhysicsBody {
    return new PhysicsBody(this.document.getGraph());
  }

  read(context: ReaderContext) {
    const nodeJsons = context.jsonDoc.json.nodes ?? [];

    nodeJsons.forEach((nodeJson, index) => {
      if (!nodeJson.extensions || !nodeJson.extensions[this.extensionName])
        return;

      const node = context.nodes[index];
      if (!node) return;

      const parsedJson = nodePhysicsBodySchema.safeParse(
        nodeJson.extensions[this.extensionName]
      );

      if (!parsedJson.success) {
        console.warn(parsedJson.error);
        return;
      }

      const physicsBodyJson = parsedJson.data;
      const physicsBody = this.createPhysicsBody();

      if (!physicsBodyJson) return;

      physicsBody.setType(physicsBodyJson.type);

      if (physicsBodyJson.mass !== undefined) {
        physicsBody.setMass(physicsBodyJson.mass);
      }

      if (physicsBodyJson.inertiaTensor !== undefined) {
        physicsBody.setInertiaTensor(physicsBodyJson.inertiaTensor);
      }

      if (physicsBodyJson.linearVelocity !== undefined) {
        physicsBody.setLinearVelocity(physicsBodyJson.linearVelocity);
      }

      if (physicsBodyJson.angularVelocity !== undefined) {
        physicsBody.setAngularVelocity(physicsBodyJson.angularVelocity);
      }

      node.setExtension(this.extensionName, physicsBody);
    });

    return this;
  }

  write(context: WriterContext) {
    // Write physics bodies
    this.document
      .getRoot()
      .listNodes()
      .forEach((node) => {
        const physicsBody = node.getExtension<PhysicsBody>(
          PhysicsBody.EXTENSION_NAME
        );
        if (!physicsBody) return;

        const nodeIndex = context.nodeIndexMap.get(node);
        if (nodeIndex === undefined) return;

        if (!context.jsonDoc.json.nodes) return;
        const nodeJson = context.jsonDoc.json.nodes[nodeIndex];
        if (!nodeJson) return;

        nodeJson.extensions = nodeJson.extensions ?? {};

        const physicsBodyJson: NodePhysicsBody = {
          angularVelocity: physicsBody.getAngularVelocity(),
          inertiaTensor: physicsBody.getInertiaTensor(),
          linearVelocity: physicsBody.getLinearVelocity(),
          mass: physicsBody.getMass(),
          type: physicsBody.getType(),
        };

        if (physicsBodyJson?.mass === 1) {
          delete physicsBodyJson.mass;
        }

        if (physicsBodyJson?.linearVelocity?.every((v) => v === 0)) {
          delete physicsBodyJson.linearVelocity;
        }

        if (physicsBodyJson?.angularVelocity?.every((v) => v === 0)) {
          delete physicsBodyJson.angularVelocity;
        }

        if (physicsBodyJson?.inertiaTensor?.every((v) => v === 0)) {
          delete physicsBodyJson.inertiaTensor;
        }

        nodeJson.extensions[this.extensionName] = physicsBodyJson;
      });

    return this;
  }
}
