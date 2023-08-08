import { Time } from "@lattice-engine/core";
import { Transform } from "@lattice-engine/scene";
import { Quat, Vec3 } from "gl-matrix/dist/esm";
import { Mut, Query, Res } from "thyseus";

import { TargetTransform } from "../components";

export function applyTargetTransforms(
  time: Res<Time>,
  entities: Query<[Mut<Transform>, TargetTransform]>,
) {
  const timeSinceLastFixedUpdate = time.mainTime - time.fixedTime;
  const percentThroughDelta =
    timeSinceLastFixedUpdate / (time.fixedDelta * 1000);

  const K = Math.min(1, percentThroughDelta);

  for (const [transform, target] of entities) {
    Vec3.lerp(
      transform.translation.array,
      transform.translation.array,
      target.translation.array,
      K,
    );

    Quat.slerp(
      transform.rotation.array,
      transform.rotation.array,
      target.rotation.array,
      K,
    );

    Vec3.lerp(
      transform.scale.array,
      transform.scale.array,
      target.scale.array,
      K,
    );
  }
}
