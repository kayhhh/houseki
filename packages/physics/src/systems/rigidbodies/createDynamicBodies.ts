import { RigidBodyDesc } from "@dimforge/rapier3d";
import {
  Entity,
  Query,
  QueryDescriptor,
  Res,
  ResourceDescriptor,
  With,
  WithDescriptor,
} from "thyseus";

import { IsDynamicBody } from "../../components";
import { PhysicsStore } from "../../PhysicsStore";

export function createDynamicBodies(
  store: Res<PhysicsStore>,
  bodies: Query<Entity, With<IsDynamicBody>>
) {
  const ids: bigint[] = [];

  for (const entity of bodies) {
    ids.push(entity.id);

    if (!store.dynamicBodies.has(entity.id)) {
      // Create new bodies
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

createDynamicBodies.parameters = [
  ResourceDescriptor(PhysicsStore),
  QueryDescriptor(Entity, WithDescriptor(IsDynamicBody)),
];
