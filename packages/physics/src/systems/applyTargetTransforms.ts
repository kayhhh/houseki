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
  const delta = time.mainTime - data.lastLoop;
  const lastUpdate = data.lastUpdate + delta;
  const percentThroughFrame = lastUpdate / (time.fixedDelta * 1000);
  const K = Math.min(percentThroughFrame, 1);

  for (const [transform, target] of entities) {
    slerp(transform.rotation, target.prev.rotation, target.rotation, K);
    lerp(transform.translation, target.prev.translation, target.translation, K);
    lerp(transform.scale, target.prev.scale, target.scale, K);
  }
}

const quat = new glQuat();
const quatb = new glQuat();

function slerp(out: Quat, start: Quat, end: Quat, K: number) {
  glQuat.set(quat, start.x, start.y, start.z, start.w);
  glQuat.set(quatb, end.x, end.y, end.z, end.w);

  glQuat.slerp(quat, quat, quatb, K);

  out.fromObject(quat);
}

const vec3 = new glVec3();
const vec3b = new glVec3();

function lerp(out: Vec3, start: Vec3, end: Vec3, K: number) {
  glVec3.set(vec3, start.x, start.y, start.z);
  glVec3.set(vec3b, end.x, end.y, end.z);

  glVec3.lerp(vec3, vec3, vec3b, K);

  out.fromObject(vec3);
}
