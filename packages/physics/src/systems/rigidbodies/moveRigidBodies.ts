import { Position } from "@lattice-engine/scene";
import {
  Entity,
  Or,
  OrDescriptor,
  Query,
  QueryDescriptor,
  Res,
  ResourceDescriptor,
  With,
  WithDescriptor,
} from "thyseus";

import { DynamicBody, KinematicBody, StaticBody } from "../../components";
import { PhysicsStore } from "../../PhysicsStore";

export function moveRigidBodies(
  store: Res<PhysicsStore>,
  bodies: Query<
    [Entity, Position],
    Or<With<StaticBody>, Or<With<KinematicBody>, With<DynamicBody>>>
  >
) {
  for (const [entity, position] of bodies) {
    const body = store.getRigidBody(entity.id);

    if (body) {
      body.setTranslation(
        {
          x: position.x,
          y: position.y,
          z: position.z,
        },
        true
      );
    }
  }
}

moveRigidBodies.parameters = [
  ResourceDescriptor(PhysicsStore),
  QueryDescriptor(
    [Entity, Position],
    OrDescriptor(
      WithDescriptor(StaticBody),
      OrDescriptor(WithDescriptor(KinematicBody), WithDescriptor(DynamicBody))
    )
  ),
];
