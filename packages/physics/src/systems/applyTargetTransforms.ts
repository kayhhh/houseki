import { Time, Vec3 } from "@houseki-engine/core";
import { Quat, Transform } from "@houseki-engine/scene";
import { Quat as glQuat, Vec3 as glVec3 } from "gl-matrix/dist/esm";
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
    slerp(transform.rotation, target.rotation, K);
    lerp(transform.translation, target.translation, K);
    lerp(transform.scale, target.scale, K);
  }
}

const quat = new glQuat();
const quatb = new glQuat();

function slerp(current: Quat, target: Quat, K: number) {
  quat.x = current.x;
  quat.y = current.y;
  quat.z = current.z;
  quat.w = current.w;
  quatb.x = target.x;
  quatb.y = target.y;
  quatb.z = target.z;
  quatb.w = target.w;

  glQuat.slerp(quat, quat, quatb, K);

  current.x = quat.x;
  current.y = quat.y;
  current.z = quat.z;
  current.w = quat.w;
}

const vec3 = new glVec3();
const vec3b = new glVec3();

function lerp(current: Vec3, target: Vec3, K: number) {
  vec3.x = current.x;
  vec3.y = current.y;
  vec3.z = current.z;
  vec3b.x = target.x;
  vec3b.y = target.y;
  vec3b.z = target.z;

  glVec3.lerp(vec3, vec3, vec3b, K);

  current.x = vec3.x;
  current.y = vec3.y;
  current.z = vec3.z;
}
