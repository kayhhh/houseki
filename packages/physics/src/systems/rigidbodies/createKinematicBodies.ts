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

import { IsKinematicBody } from "../../components";
import { PhysicsStore } from "../../PhysicsStore";

export function createKinematicBodies(
  store: Res<PhysicsStore>,
  bodies: Query<Entity, With<IsKinematicBody>>
) {
  const ids: bigint[] = [];

  for (const entity of bodies) {
    ids.push(entity.id);

    if (!store.kinematicBodies.has(entity.id)) {
      // Create new bodies
      const rigidBodyDesc = RigidBodyDesc.kinematicPositionBased();
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

createKinematicBodies.parameters = [
  ResourceDescriptor(PhysicsStore),
  QueryDescriptor(Entity, WithDescriptor(IsKinematicBody)),
];
