import { Position } from "@lattice-engine/scene";
import { Entity, Or, Query, Res, With, Without } from "thyseus";

import {
  CharacterController,
  DynamicBody,
  KinematicBody,
  StaticBody,
} from "../../components";
import { PhysicsStore } from "../../PhysicsStore";

export function moveRigidBodies(
  store: Res<PhysicsStore>,
  bodies: Query<
    [Entity, Position],
    [
      Or<With<StaticBody>, Or<With<KinematicBody>, With<DynamicBody>>>,
      Without<CharacterController>
    ]
  >
) {
  for (const [entity, position] of bodies) {
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
}
