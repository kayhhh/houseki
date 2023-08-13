import { Time } from "@lattice-engine/core";
import { Transform } from "@lattice-engine/scene";
import { Quat, Vec3 } from "gl-matrix/dist/esm";
import { Mut, Query, Res } from "thyseus";

import { TargetTransform } from "../components";

export function applyTargetTransforms(
  time: Res<Time>,
  entities: Query<[Mut<Transform>, TargetTransform]>
) {
  const timeSinceLastFixedUpdate = time.mainTime - time.fixedTime;
  const percentThroughDelta =
    timeSinceLastFixedUpdate / (time.fixedDelta * 1000);

  const K = Math.min(1, percentThroughDelta);

  for (const [transform, target] of entities) {
    Vec3.lerp(
      transform.translation.toArray(),
      transform.translation.toArray(),
      target.translation.toArray(),
      K
    );

    Quat.slerp(
      transform.rotation.toArray(),
      transform.rotation.toArray(),
      target.rotation.toArray(),
      K
    );

    Vec3.lerp(
      transform.scale.toArray(),
      transform.scale.toArray(),
      target.scale.toArray(),
      K
    );
  }
}
