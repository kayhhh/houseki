import { FixedLoopData, Time, Vec3 } from "@houseki-engine/core";
import { Quat, Transform } from "@houseki-engine/scene";
import { Quat as glQuat, Vec3 as glVec3 } from "gl-matrix/dist/esm";
import { Mut, Query, Res } from "thyseus";

import { TargetTransform } from "../components";

export function applyTargetTransforms(
  time: Res<Time>,
  data: Res<FixedLoopData>,
  entities: Query<[Mut<Transform>, TargetTransform]>
) {
  // data.lastUpdate has not been calculated yet for this frame
  // so we add the delta to the lastUpdate here from the previous frame
  const now = performance.now();
  const delta = now - data.lastLoop;
  const lastUpdate = data.lastUpdate + delta;
  const K = lastUpdate / (time.fixedDelta * 1000);

  for (const [transform, target] of entities) {
    slerp(transform.rotation, target.prev.rotation, target.rotation, K);
    lerp(transform.translation, target.prev.translation, target.translation, K);
    lerp(transform.scale, target.prev.scale, target.scale, K);
  }
}

const quat = new glQuat();
const quatb = new glQuat();

function slerp(out: Quat, start: Quat, end: Quat, K: number) {
  quat.x = start.x;
  quat.y = start.y;
  quat.z = start.z;
  quat.w = start.w;

  quatb.x = end.x;
  quatb.y = end.y;
  quatb.z = end.z;
  quatb.w = end.w;

  glQuat.slerp(quat, quat, quatb, K);

  out.x = quat.x;
  out.y = quat.y;
  out.z = quat.z;
  out.w = quat.w;
}

const vec3 = new glVec3();
const vec3b = new glVec3();

function lerp(out: Vec3, start: Vec3, end: Vec3, K: number) {
  vec3.x = start.x;
  vec3.y = start.y;
  vec3.z = start.z;

  vec3b.x = end.x;
  vec3b.y = end.y;
  vec3b.z = end.z;

  glVec3.lerp(vec3, vec3, vec3b, K);

  out.x = vec3.x;
  out.y = vec3.y;
  out.z = vec3.z;
}
