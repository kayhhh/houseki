import { Position } from "@lattice-engine/scene";
import {
  Entity,
  Mut,
  MutDescriptor,
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

export function saveRigidBodyPositions(
  store: Res<PhysicsStore>,
  bodies: Query<
    [Entity, Mut<Position>],
    Or<With<StaticBody>, Or<With<KinematicBody>, With<DynamicBody>>>
  >
) {
  for (const [entity, position] of bodies) {
    const body = store.getRigidBody(entity.id);

    if (body) {
      const translation = body.translation();
      position.x = translation.x;
      position.y = translation.y;
      position.z = translation.z;
    }
  }
}

saveRigidBodyPositions.parameters = [
  ResourceDescriptor(PhysicsStore),
  QueryDescriptor(
    [Entity, MutDescriptor(Position)],
    OrDescriptor(
      WithDescriptor(StaticBody),
      OrDescriptor(WithDescriptor(KinematicBody), WithDescriptor(DynamicBody))
    )
  ),
];
