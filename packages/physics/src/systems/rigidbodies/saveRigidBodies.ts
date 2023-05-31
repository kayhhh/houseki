import { Position, Rotation } from "@lattice-engine/scene";
import { Entity, Mut, Or, Query, Res, With } from "thyseus";

import { DynamicBody, KinematicBody, StaticBody } from "../../components";
import { PhysicsStore } from "../../resources";

export function saveRigidBodies(
  store: Res<PhysicsStore>,
  withPosition: Query<
    [Entity, Mut<Position>],
    Or<With<StaticBody>, Or<With<KinematicBody>, With<DynamicBody>>>
  >,
  withRotation: Query<
    [Entity, Mut<Rotation>],
    Or<With<StaticBody>, Or<With<KinematicBody>, With<DynamicBody>>>
  >
) {
  // Save positions
  for (const [entity, position] of withPosition) {
    const body = store.getRigidBody(entity.id);
    if (!body) continue;

    const translation = body.translation();
    position.fromObject(translation);
  }

  // Save rotations
  for (const [entity, rotation] of withRotation) {
    const body = store.getRigidBody(entity.id);
    if (!body) continue;

    const quaternion = body.rotation();
    rotation.fromObject(quaternion);
  }
}
