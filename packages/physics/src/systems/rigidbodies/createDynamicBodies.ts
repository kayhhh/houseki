import { RigidBodyDesc } from "@dimforge/rapier3d";
import { Entity, Query, Res, With } from "thyseus";

import { DynamicBody } from "../../components";
import { PhysicsStore } from "../../resources";

export function createDynamicBodies(
  store: Res<PhysicsStore>,
  bodies: Query<Entity, With<DynamicBody>>
) {
  const ids: bigint[] = [];

  for (const entity of bodies) {
    ids.push(entity.id);

    // Create new bodies
    if (!store.dynamicBodies.has(entity.id)) {
      const rigidBodyDesc = RigidBodyDesc.dynamic();
      const object = store.world.createRigidBody(rigidBodyDesc);
      store.dynamicBodies.set(entity.id, object);
    }
  }

  // Remove bodies that are no longer in use
  for (const id of store.dynamicBodies.keys()) {
    if (!ids.includes(id)) {
      const object = store.dynamicBodies.get(id);
      if (object) store.world.removeRigidBody(object);
      store.dynamicBodies.delete(id);
    }
  }
}
