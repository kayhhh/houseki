import { GlobalTransform, Parent, Transform } from "@houseki-engine/scene";
import { Mat4, Quat, Vec3, Vec4 } from "gl-matrix/dist/esm";
import { Entity, Mut, Or, Query, Res, With, Without } from "thyseus";

import {
  DynamicBody,
  KinematicBody,
  StaticBody,
  TargetTransform,
} from "../../components";
import { PhysicsStore } from "../../resources";

const vec4 = new Vec4();
const vec3 = new Vec3();
const vec3b = new Vec3();
const quat = new Quat();
const mat4 = new Mat4();

export function saveRigidBodies(
  store: Res<PhysicsStore>,
  bodies: Query<
    Parent,
    [
      With<[Transform, GlobalTransform]>,
      Or<With<StaticBody>, Or<With<KinematicBody>, With<DynamicBody>>>
    ]
  >,
  withTarget: Query<
    [Entity, Parent, Mut<TargetTransform>],
    [Or<With<StaticBody>, Or<With<KinematicBody>, With<DynamicBody>>>]
  >,
  withoutTarget: Query<
    [Entity, Parent, Mut<Transform>],
    [
      Or<With<StaticBody>, Or<With<KinematicBody>, With<DynamicBody>>>,
      Without<TargetTransform>
    ]
  >,
  transforms: Query<[Entity, GlobalTransform]>
) {
  const parentIds = new Set<bigint>();

  for (const parent of bodies) {
    parentIds.add(parent.id);
  }

  const globalTransforms = new Map<bigint, Mat4>();

  for (const [entity, globalTransform] of transforms) {
    if (!parentIds.has(entity.id)) continue;

    const globalMat = new Mat4();
    globalTransforms.set(entity.id, globalMat);

    vec4.x = globalTransform.rotation.x;
    vec4.y = globalTransform.rotation.y;
    vec4.z = globalTransform.rotation.z;
    vec4.w = globalTransform.rotation.w;

    vec3.x = globalTransform.translation.x;
    vec3.y = globalTransform.translation.y;
    vec3.z = globalTransform.translation.z;

    vec3b.x = globalTransform.scale.x;
    vec3b.y = globalTransform.scale.y;
    vec3b.z = globalTransform.scale.z;

    Mat4.fromRotationTranslationScale(globalMat, vec4, vec3, vec3b);

    globalMat.invert();
  }

  for (const [entity, parent, transform] of withoutTarget) {
    const body = store.getRigidBody(entity.id);
    if (!body) continue;

    const parentGlobal = globalTransforms.get(parent.id) ?? new Mat4();

    const translation = body.translation();
    const rotation = body.rotation();

    // Convert to local space
    Vec3.set(vec3, translation.x, translation.y, translation.z);
    Quat.set(quat, rotation.x, rotation.y, rotation.z, rotation.w);
    Vec3.set(vec3b, transform.scale.x, transform.scale.y, transform.scale.z);

    Mat4.fromRotationTranslationScale(mat4, quat, vec3, vec3b);

    Mat4.multiply(mat4, parentGlobal, mat4);

    Mat4.getTranslation(vec3, mat4);
    Mat4.getRotation(quat, mat4);

    transform.translation.fromObject(vec3);
    transform.rotation.fromObject(quat);
  }

  for (const [entity, parent, target] of withTarget) {
    const body = store.getRigidBody(entity.id);
    if (!body) continue;

    const parentGlobal = globalTransforms.get(parent.id) ?? new Mat4();

    const translation = body.translation();
    const rotation = body.rotation();

    // Convert to local space
    Vec3.set(vec3, translation.x, translation.y, translation.z);
    Quat.set(quat, rotation.x, rotation.y, rotation.z, rotation.w);
    Vec3.set(vec3b, target.scale.x, target.scale.y, target.scale.z);

    Mat4.fromRotationTranslationScale(mat4, quat, vec3, vec3b);

    Mat4.multiply(mat4, parentGlobal, mat4);

    Mat4.getTranslation(vec3, mat4);
    Mat4.getRotation(quat, mat4);

    target.translation.fromObject(vec3);
    target.rotation.fromObject(quat);
  }
}
