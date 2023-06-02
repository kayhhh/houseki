import { Transform } from "@lattice-engine/scene";
import { Entity, Mut, Or, Query, Res, With } from "thyseus";

import { DynamicBody, KinematicBody, StaticBody } from "../../components";
import { PhysicsStore } from "../../resources";

export function saveRigidBodies(
  store: Res<PhysicsStore>,
  transforms: Query<
    [Entity, Mut<Transform>],
    Or<With<StaticBody>, Or<With<KinematicBody>, With<DynamicBody>>>
  >
) {
  for (const [entity, transform] of transforms) {
    const body = store.getRigidBody(entity.id);
    if (!body) continue;

    const translation = body.translation();
    transform.translation.fromObject(translation);

    const rotation = body.rotation();
    transform.rotation.fromObject(rotation);
  }
}
