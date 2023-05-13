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

import { IsStaticBody } from "../../components";
import { PhysicsStore } from "../../PhysicsStore";

export function createStaticBodies(
  store: Res<PhysicsStore>,
  bodies: Query<Entity, With<IsStaticBody>>
) {
  const ids: bigint[] = [];

  for (const entity of bodies) {
    ids.push(entity.id);

    if (!store.staticBodies.has(entity.id)) {
      // Create new bodies
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

createStaticBodies.parameters = [
  ResourceDescriptor(PhysicsStore),
  QueryDescriptor(Entity, WithDescriptor(IsStaticBody)),
];
