import { GlobalTransform } from "@houseki-engine/scene";
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
  globalTransforms: Query<
    [Entity, GlobalTransform],
    [Or<With<StaticBody>, Or<With<KinematicBody>, With<DynamicBody>>>]
  >,
  velocities: Query<
    [Entity, Velocity],
    [Or<With<StaticBody>, Or<With<KinematicBody>, With<DynamicBody>>>]
  >
) {
  // Set positions
  for (const [entity, globalTransform] of globalTransforms) {
    const body = store.getRigidBody(entity.id);
    if (!body) continue;

    body.setTranslation(globalTransform.translation, true);
  }

  // Set velocities
  for (const [entity, velocity] of velocities) {
    const body = store.getRigidBody(entity.id);
    if (!body) continue;

    body.setLinvel(velocity, true);
  }
}
