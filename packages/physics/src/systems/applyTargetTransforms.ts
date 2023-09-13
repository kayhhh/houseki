import { FixedLoopData, Time, Vec3 } from "@houseki-engine/core";
import { Quat, Transform } from "@houseki-engine/scene";
import { Quaternion, Vector3 } from "three";
import { Mut, Query, Res } from "thyseus";

import { PrevTargetTransform, TargetTransform } from "../components";

export function applyTargetTransforms(
  time: Res<Time>,
  fixedData: Res<FixedLoopData>,
  entities: Query<[Mut<Transform>, TargetTransform, PrevTargetTransform]>
) {
  const delta = time.mainTime - fixedData.lastLoop;
  const lastUpdate = fixedData.lastUpdate + delta;
  const K = lastUpdate / (time.fixedDelta * 1000);

  for (const [transform, target, prev] of entities) {
    slerp(transform.rotation, prev.rotation, target.rotation, K);
    lerp(transform.translation, prev.translation, target.translation, K);
    lerp(transform.scale, prev.scale, target.scale, K);
  }
}

const quat = new Quaternion();
const quatb = new Quaternion();

function slerp(out: Quat, start: Quat, end: Quat, K: number) {
  quat.set(start.x, start.y, start.z, start.w);
  quatb.set(end.x, end.y, end.z, end.w);

  quat.slerp(quatb, K);

  out.fromObject(quat);
}

const vec3 = new Vector3();
const vec3b = new Vector3();

function lerp(out: Vec3, start: Vec3, end: Vec3, K: number) {
  vec3.set(start.x, start.y, start.z);
  vec3b.set(end.x, end.y, end.z);

  vec3.lerp(vec3b, K);

  out.fromObject(vec3);
}
