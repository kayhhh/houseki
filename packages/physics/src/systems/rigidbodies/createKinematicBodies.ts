import { RigidBodyDesc } from "@dimforge/rapier3d";
import { Entity, Query, Res, With } from "thyseus";

import { KinematicBody } from "../../components";
import { PhysicsStore } from "../../resources";

export function createKinematicBodies(
  store: Res<PhysicsStore>,
  bodies: Query<Entity, With<KinematicBody>>,
) {
  const ids: bigint[] = [];

  for (const entity of bodies) {
    ids.push(entity.id);

    // Create new bodies
    if (!store.kinematicBodies.has(entity.id)) {
      const rigidBodyDesc = RigidBodyDesc.kinematicVelocityBased();
      const object = store.world.createRigidBody(rigidBodyDesc);
      store.kinematicBodies.set(entity.id, object);
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
