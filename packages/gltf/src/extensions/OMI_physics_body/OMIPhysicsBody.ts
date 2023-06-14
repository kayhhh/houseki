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
    const nodeDefs = context.jsonDoc.json.nodes ?? [];

    nodeDefs.forEach((nodeDef, index) => {
      if (!nodeDef.extensions || !nodeDef.extensions[this.extensionName])
        return;

      const node = context.nodes[index];
      if (!node) return;

      const parsedDef = nodePhysicsBodySchema.safeParse(
        nodeDef.extensions[this.extensionName]
      );

      if (!parsedDef.success) {
        console.warn(parsedDef.error);
        return;
      }

      const physicsBodyDef = parsedDef.data;
      const physicsBody = this.createPhysicsBody();

      physicsBody.setType(physicsBodyDef.type);

      if (physicsBodyDef.mass !== undefined) {
        physicsBody.setMass(physicsBodyDef.mass);
      }

      if (physicsBodyDef.inertiaTensor !== undefined) {
        physicsBody.setInertiaTensor(physicsBodyDef.inertiaTensor);
      }

      if (physicsBodyDef.linearVelocity !== undefined) {
        physicsBody.setLinearVelocity(physicsBodyDef.linearVelocity);
      }

      if (physicsBodyDef.angularVelocity !== undefined) {
        physicsBody.setAngularVelocity(physicsBodyDef.angularVelocity);
      }

      node.setExtension(this.extensionName, physicsBody);
    });

    return this;
  }

  write(context: WriterContext) {
    this.document
      .getRoot()
      .listNodes()
      .forEach((node) => {
        const physicsBody = node.getExtension<PhysicsBody>(this.extensionName);
        if (!physicsBody) return;

        const nodeIndex = context.nodeIndexMap.get(node);
        if (nodeIndex === undefined) return;

        if (!context.jsonDoc.json.nodes) return;
        const nodeDef = context.jsonDoc.json.nodes[nodeIndex];
        if (!nodeDef) return;

        nodeDef.extensions = nodeDef.extensions ?? {};

        const physicsBodyDef: NodePhysicsBody = {
          angularVelocity: physicsBody.getAngularVelocity(),
          inertiaTensor: physicsBody.getInertiaTensor(),
          linearVelocity: physicsBody.getLinearVelocity(),
          mass: physicsBody.getMass(),
          type: physicsBody.getType(),
        };

        if (physicsBodyDef.mass === 1) {
          delete physicsBodyDef.mass;
        }

        if (physicsBodyDef.linearVelocity?.every((v) => v === 0)) {
          delete physicsBodyDef.linearVelocity;
        }

        if (physicsBodyDef.angularVelocity?.every((v) => v === 0)) {
          delete physicsBodyDef.angularVelocity;
        }

        if (physicsBodyDef.inertiaTensor?.every((v) => v === 0)) {
          delete physicsBodyDef.inertiaTensor;
        }

        nodeDef.extensions[this.extensionName] = physicsBodyDef;
      });

    return this;
  }
}
