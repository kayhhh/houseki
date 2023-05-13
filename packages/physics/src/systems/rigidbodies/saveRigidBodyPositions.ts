import { Position } from "@lattice-engine/core";
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

import { IsDynamicBody, IsKinematicBody, IsStaticBody } from "../../components";
import { PhysicsStore } from "../../PhysicsStore";

export function saveRigidBodyPositions(
  store: Res<PhysicsStore>,
  bodies: Query<
    [Entity, Mut<Position>],
    Or<With<IsStaticBody>, Or<With<IsKinematicBody>, With<IsDynamicBody>>>
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
      WithDescriptor(IsStaticBody),
      OrDescriptor(
        WithDescriptor(IsKinematicBody),
        WithDescriptor(IsDynamicBody)
      )
    )
  ),
];
