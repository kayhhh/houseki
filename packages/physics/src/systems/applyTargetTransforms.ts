import { Time } from "@lattice-engine/core";
import { Transform } from "@lattice-engine/scene";
import { Quat, Vec3 } from "gl-matrix/dist/esm";
import { Mut, Query, Res } from "thyseus";

import { TargetTransform } from "../components";

const vec3 = new Vec3();
const quat = new Quat();

export function applyTargetTransforms(
  time: Res<Time>,
  entities: Query<[Mut<Transform>, TargetTransform]>
) {
  const timeSinceLastFixedUpdate = time.mainTime - time.fixedTime;
  const percentThroughDelta =
    timeSinceLastFixedUpdate / (time.fixedDelta * 1000);

  const K = Math.min(1, percentThroughDelta);

  for (const [transform, target] of entities) {
    Vec3.lerp(vec3, transform.translation.array, target.translation.array, K);
    transform.translation.set(vec3.x, vec3.y, vec3.z);

    Quat.slerp(quat, transform.rotation.array, target.rotation.array, K);
    transform.rotation.set(quat.x, quat.y, quat.z, quat.w);

    Vec3.lerp(vec3, transform.scale.array, target.scale.array, K);
    transform.scale.set(vec3.x, vec3.y, vec3.z);
  }
}
