import { Rotation } from "@lattice-engine/scene";
import { Entity, Or, Query, Res, With } from "thyseus";

import { DynamicBody, KinematicBody, StaticBody } from "../../components";
import { PhysicsStore } from "../../resources";

export function rotateRigidBodies(
  store: Res<PhysicsStore>,
  bodies: Query<
    [Entity, Rotation],
    Or<With<StaticBody>, Or<With<KinematicBody>, With<DynamicBody>>>
  >
) {
  for (const [entity, rotation] of bodies) {
    const body = store.getRigidBody(entity.id);

    if (body) {
      body.setRotation(rotation.toObject(), true);
    }
  }
}
