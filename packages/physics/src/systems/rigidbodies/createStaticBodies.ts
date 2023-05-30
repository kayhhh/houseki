import { RigidBodyDesc } from "@dimforge/rapier3d";
import { Entity, Query, Res, With } from "thyseus";

import { StaticBody } from "../../components";
import { PhysicsStore } from "../../resources";

export function createStaticBodies(
  store: Res<PhysicsStore>,
  bodies: Query<Entity, With<StaticBody>>
) {
  const ids: bigint[] = [];

  for (const entity of bodies) {
    ids.push(entity.id);

    // Create new bodies
    if (!store.staticBodies.has(entity.id)) {
      const rigidBodyDesc = RigidBodyDesc.fixed();
      const object = store.world.createRigidBody(rigidBodyDesc);
      store.staticBodies.set(entity.id, object);
    }
  }

  // Remove bodies that are no longer in use
  for (const id of store.staticBodies.keys()) {
    if (!ids.includes(id)) {
      const object = store.staticBodies.get(id);
      if (object) store.world.removeRigidBody(object);

      store.staticBodies.delete(id);
    }
  }
}
