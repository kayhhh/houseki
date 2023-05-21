import { Position } from "@lattice-engine/scene";
import { Entity, Or, Query, Res, With } from "thyseus";

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
