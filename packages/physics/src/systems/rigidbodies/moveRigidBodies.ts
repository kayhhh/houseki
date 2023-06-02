import { Transform } from "@lattice-engine/scene";
import { Entity, Or, Query, Res, With } from "thyseus";

import {
  DynamicBody,
  KinematicBody,
  StaticBody,
  Velocity,
} from "../../components";
import { PhysicsStore } from "../../resources";

export function moveRigidBodies(
  store: Res<PhysicsStore>,
  transforms: Query<
    [Entity, Transform],
    [Or<With<StaticBody>, Or<With<KinematicBody>, With<DynamicBody>>>]
  >,
  velocities: Query<
    [Entity, Velocity],
    [Or<With<StaticBody>, Or<With<KinematicBody>, With<DynamicBody>>>]
  >
) {
  // Set positions
  for (const [entity, transform] of transforms) {
    const body = store.getRigidBody(entity.id);
    if (!body) continue;

    body.setTranslation(transform.translation.toObject(), true);
  }

  // Set velocities
  for (const [entity, velocity] of velocities) {
    const body = store.getRigidBody(entity.id);
    if (!body) continue;

    body.setLinvel(velocity.toObject(), true);
  }
}
