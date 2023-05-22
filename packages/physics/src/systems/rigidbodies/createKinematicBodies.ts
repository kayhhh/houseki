import { RigidBodyDesc } from "@dimforge/rapier3d";
import { Position } from "@lattice-engine/scene";
import { Entity, Query, Res, With } from "thyseus";

import { KinematicBody } from "../../components";
import { PhysicsStore } from "../../PhysicsStore";

export function createKinematicBodies(
  store: Res<PhysicsStore>,
  bodies: Query<Entity, With<KinematicBody>>,
  positions: Query<[Entity, Position], With<KinematicBody>>
) {
  const ids: bigint[] = [];

  for (const entity of bodies) {
    ids.push(entity.id);

    if (!store.kinematicBodies.has(entity.id)) {
      // Create new bodies
      const rigidBodyDesc = RigidBodyDesc.kinematicPositionBased();
      const object = store.world.createRigidBody(rigidBodyDesc);
      store.kinematicBodies.set(entity.id, object);

      // Set initial position
      for (const [e, position] of positions) {
        if (e.id === entity.id) {
          object.setTranslation(
            {
              x: position.x,
              y: position.y,
              z: position.z,
            },
            true
          );
          break;
        }
      }
    }
  }

  // Remove bodies that are no longer in use
  for (const id of store.kinematicBodies.keys()) {
    if (!ids.includes(id)) {
      const object = store.kinematicBodies.get(id);
      if (object) store.world.removeRigidBody(object);

      store.kinematicBodies.delete(id);
    }
  }
}
