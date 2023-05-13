import { Rotation } from "@lattice-engine/core";
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

import { IsDynamicBody, IsKinematicBody, IsStaticBody } from "../../components";
import { PhysicsStore } from "../../PhysicsStore";

export function rotateRigidBodies(
  store: Res<PhysicsStore>,
  bodies: Query<
    [Entity, Rotation],
    Or<With<IsStaticBody>, Or<With<IsKinematicBody>, With<IsDynamicBody>>>
  >
) {
  for (const [entity, rotation] of bodies) {
    const body = store.getRigidBody(entity.id);

    if (body) {
      body.setRotation(
        {
          w: rotation.w,
          x: rotation.x,
          y: rotation.y,
          z: rotation.z,
        },
        true
      );
    }
  }
}

rotateRigidBodies.parameters = [
  ResourceDescriptor(PhysicsStore),
  QueryDescriptor(
    [Entity, Rotation],
    OrDescriptor(
      WithDescriptor(IsStaticBody),
      OrDescriptor(
        WithDescriptor(IsKinematicBody),
        WithDescriptor(IsDynamicBody)
      )
    )
  ),
];
