import { Node } from "@gltf-transform/core";
import { Warehouse } from "@lattice-engine/core";
import { StaticBody } from "@lattice-engine/physics";
import { Commands, dropStruct } from "thyseus";

import { Collider } from "../extensions/OMI_collider/Collider";
import { PhysicsBody } from "../extensions/OMI_physics_body/PhysicsBody";
import { ImportContext } from "./context";
import { importMesh } from "./importMesh";

export function importNode(
  node: Node,
  parentId: bigint,
  commands: Commands,
  warehouse: Readonly<Warehouse>,
  context: ImportContext
) {
  const nodePosition = node.getTranslation();
  const nodeRotation = node.getRotation();
  const nodeScale = node.getScale();

  const globalPosition = node.getWorldTranslation();
  const globalRotation = node.getWorldRotation();
  const globalScale = node.getWorldScale();

  context.transform.set(nodePosition, nodeRotation, nodeScale);
  context.globalTransform.set(globalPosition, globalRotation, globalScale);

  context.parent.id = parentId;

  context.name.value = node.getName() || `Node_${context.nodes.size}`;

  const entityId = commands
    .spawn(true)
    .add(context.transform)
    .add(context.globalTransform)
    .add(context.parent)
    .add(context.name).id;

  context.nodes.set(node, entityId);

  const mesh = node.getMesh();
  if (mesh) importMesh(mesh, entityId, commands, warehouse, context);

  const physicsBody = node.getExtension<PhysicsBody>(
    PhysicsBody.EXTENSION_NAME
  );
  if (physicsBody) {
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

        commands.getById(entityId).add(context.kinematicBody);
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

        context.targetTransform.set(nodePosition, nodeRotation, nodeScale);

        commands
          .getById(entityId)
          .add(context.dynamicBody)
          .add(context.targetTransform);
        break;
      }

      default: {
        console.warn(`Unsupported physics body type: ${physicsBody.getType()}`);
        break;
      }
    }
  }

  const collider = node.getExtension<Collider>(Collider.EXTENSION_NAME);
  if (collider) {
    switch (collider.getType()) {
      case "box": {
        context.boxCollider.size.fromArray(collider.getSize());
        commands.getById(entityId).add(context.boxCollider);
        break;
      }

      case "sphere": {
        context.sphereCollider.radius = collider.getRadius();
        commands.getById(entityId).add(context.sphereCollider);
        break;
      }

      case "capsule": {
        context.capsuleCollider.radius = collider.getRadius();
        context.capsuleCollider.height = collider.getHeight();
        commands.getById(entityId).add(context.capsuleCollider);
        break;
      }

      case "cylinder": {
        context.cylinderCollider.radius = collider.getRadius();
        context.cylinderCollider.height = collider.getHeight();
        commands.getById(entityId).add(context.cylinderCollider);
        dropStruct(context.cylinderCollider);
        break;
      }

      case "hull": {
        const mesh = collider.getMesh();

        for (const [m, id] of context.meshes) {
          if (m !== mesh) continue;
          context.hullCollider.meshId = id;
          commands.getById(entityId).add(context.hullCollider);
          break;
        }
        break;
      }

      case "trimesh": {
        const mesh = collider.getMesh();

        for (const [m, id] of context.meshes) {
          if (m !== mesh) continue;
          context.meshCollider.meshId = id;
          commands.getById(entityId).add(context.meshCollider);
          break;
        }
        break;
      }
    }
  }

  node
    .listChildren()
    .forEach((child) =>
      importNode(child, entityId, commands, warehouse, context)
    );
}
