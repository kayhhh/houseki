import { Node } from "@gltf-transform/core";
import { StaticBody } from "@houseki-engine/physics";
import { Commands } from "thyseus";

import { PhysicsBody } from "../extensions/OMI_physics_body/PhysicsBody";
import { ImportContext } from "./context";

export function importPhysicsBody(
  context: ImportContext,
  commands: Commands,
  node: Node,
  entityId: bigint
) {
  const physicsBody = node.getExtension<PhysicsBody>(
    PhysicsBody.EXTENSION_NAME
  );

  if (!physicsBody) return;

  switch (physicsBody.getType()) {
    case "Static": {
      commands.getById(entityId).addType(StaticBody);
      break;
    }

    case "Kinematic": {
      context.kinematicBody.mass = physicsBody.getMass();
      context.kinematicBody.linearVelocity.fromArray(
        physicsBody.getLinearVelocity()
      );
      context.kinematicBody.angularVelocity.fromArray(
        physicsBody.getAngularVelocity()
      );

      const nodePosition = node.getTranslation();
      const nodeRotation = node.getRotation();
      const nodeScale = node.getScale();

      context.targetTransform.set(nodePosition, nodeRotation, nodeScale);
      context.prevTargetTransform.set(nodePosition, nodeRotation, nodeScale);

      commands
        .getById(entityId)
        .add(context.kinematicBody)
        .add(context.targetTransform)
        .add(context.prevTargetTransform);
      break;
    }

    case "Rigid": {
      context.dynamicBody.mass = physicsBody.getMass();
      context.dynamicBody.linearVelocity.fromArray(
        physicsBody.getLinearVelocity()
      );
      context.dynamicBody.angularVelocity.fromArray(
        physicsBody.getAngularVelocity()
      );

      const nodePosition = node.getTranslation();
      const nodeRotation = node.getRotation();
      const nodeScale = node.getScale();

      context.targetTransform.set(nodePosition, nodeRotation, nodeScale);
      context.prevTargetTransform.set(nodePosition, nodeRotation, nodeScale);

      commands
        .getById(entityId)
        .add(context.dynamicBody)
        .add(context.targetTransform)
        .add(context.prevTargetTransform);
      break;
    }

    default: {
      console.warn(`Unsupported physics body type: ${physicsBody.getType()}`);
      break;
    }
  }
}
