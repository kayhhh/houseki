import { RigidBodyDesc } from "@dimforge/rapier3d";
import { Entity, Query, Res } from "thyseus";

import { DynamicBody } from "../../components";
import { PhysicsStore } from "../../resources";

export function createDynamicBodies(
  store: Res<PhysicsStore>,
  bodies: Query<[Entity, DynamicBody]>
) {
  const ids: bigint[] = [];

  for (const [entity, body] of bodies) {
    ids.push(entity.id);

    // Create new bodies
    if (!store.dynamicBodies.has(entity.id)) {
      const rigidBodyDesc = RigidBodyDesc.dynamic();
      const object = store.world.createRigidBody(rigidBodyDesc);

      object.setAdditionalMass(body.mass, true);
      object.setLinvel(body.linearVelocity, true);
      object.setAngvel(body.angularVelocity, true);

      store.dynamicBodies.set(entity.id, object);
    }
  }

  // Remove bodies that are no longer in use
  for (const id of store.dynamicBodies.keys()) {
    if (!ids.includes(id)) {
      const object = store.dynamicBodies.get(id);
      if (object) {
        store.world.removeRigidBody(object);
      }

      store.dynamicBodies.delete(id);
    }
  }
}
