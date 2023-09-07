import { GlobalTransform } from "@reddo/scene";
import { Entity, Or, Query, Res, With } from "thyseus";

import { DynamicBody, KinematicBody, StaticBody } from "../../components";
import { PhysicsStore } from "../../resources";

export function rotateRigidBodies(
  store: Res<PhysicsStore>,
  bodies: Query<
    [Entity, GlobalTransform],
    Or<With<StaticBody>, Or<With<KinematicBody>, With<DynamicBody>>>
  >
) {
  for (const [entity, globalTransform] of bodies) {
    const body = store.getRigidBody(entity.id);

    if (body) {
      body.setRotation(globalTransform.rotation.toObject(), true);
    }
  }
}
