import { Node } from "@gltf-transform/core";
import { Commands } from "thyseus";

import { Shape } from "../extensions/OMI_physics_shape/Shape";
import { ImportContext } from "./context";

export function importCollider(
  context: ImportContext,
  commands: Commands,
  node: Node,
  entityId: bigint
) {
  const collider = node.getExtension<Shape>(Shape.EXTENSION_NAME);

  if (!collider) return;

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
      break;
    }

    case "convex": {
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
