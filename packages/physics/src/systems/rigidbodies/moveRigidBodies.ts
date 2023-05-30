import { Position } from "@lattice-engine/scene";
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
  positions: Query<
    [Entity, Position],
    [Or<With<StaticBody>, Or<With<KinematicBody>, With<DynamicBody>>>]
  >,
  velocities: Query<
    [Entity, Velocity],
    [Or<With<StaticBody>, Or<With<KinematicBody>, With<DynamicBody>>>]
  >
) {
  // Set positions
  for (const [entity, position] of positions) {
    const body = store.getRigidBody(entity.id);
    if (!body) continue;

    body.setTranslation(
      {
        x: position.x,
        y: position.y,
        z: position.z,
      },
      true
    );
  }

  // Set velocities
  for (const [entity, velocity] of velocities) {
    const body = store.getRigidBody(entity.id);
    if (!body) continue;

    body.setLinvel(
      {
        x: velocity.x,
        y: velocity.y,
        z: velocity.z,
      },
      true
    );
  }
}
