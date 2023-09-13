import { GlobalTransform, Parent, Transform } from "@houseki-engine/scene";
import { Matrix4, Quaternion, Vector3 } from "three";
import { Entity, Mut, Or, Query, Res, With, Without } from "thyseus";

import {
  DynamicBody,
  KinematicBody,
  StaticBody,
  TargetTransform,
} from "../../components";
import { PhysicsStore } from "../../resources";

const vec3 = new Vector3();
const vec3b = new Vector3();
const quat = new Quaternion();
const mat4 = new Matrix4();

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

  const globalTransforms = new Map<bigint, Matrix4>();

  for (const [entity, globalTransform] of transforms) {
    if (!parentIds.has(entity.id)) continue;

    const globalMat = new Matrix4();
    globalTransforms.set(entity.id, globalMat);

    quat.set(
      globalTransform.rotation.x,
      globalTransform.rotation.y,
      globalTransform.rotation.z,
      globalTransform.rotation.w
    );
    vec3.set(
      globalTransform.translation.x,
      globalTransform.translation.y,
      globalTransform.translation.z
    );
    vec3b.set(
      globalTransform.scale.x,
      globalTransform.scale.y,
      globalTransform.scale.z
    );

    globalMat.compose(vec3, quat, vec3b);

    globalMat.invert();
  }

  for (const [entity, parent, transform] of withoutTarget) {
    const body = store.getRigidBody(entity.id);
    if (!body) continue;

    const parentGlobal = globalTransforms.get(parent.id) ?? new Matrix4();

    const translation = body.translation();
    const rotation = body.rotation();

    // Convert to local space
    quat.set(rotation.x, rotation.y, rotation.z, rotation.w);
    vec3.set(translation.x, translation.y, translation.z);
    vec3b.set(transform.scale.x, transform.scale.y, transform.scale.z);

    mat4.compose(vec3, quat, vec3b);
    mat4.multiplyMatrices(parentGlobal, mat4);
    mat4.decompose(vec3, quat, vec3b);

    transform.translation.fromObject(vec3);
    transform.rotation.fromObject(quat);
  }

  for (const [entity, parent, target] of withTarget) {
    const body = store.getRigidBody(entity.id);
    if (!body) continue;

    const parentGlobal = globalTransforms.get(parent.id) ?? new Matrix4();

    const translation = body.translation();
    const rotation = body.rotation();

    // Convert to local space
    quat.set(rotation.x, rotation.y, rotation.z, rotation.w);
    vec3.set(translation.x, translation.y, translation.z);
    vec3b.set(target.scale.x, target.scale.y, target.scale.z);

    mat4.compose(vec3, quat, vec3b);
    mat4.multiplyMatrices(parentGlobal, mat4);
    mat4.decompose(vec3, quat, vec3b);

    target.translation.fromObject(vec3);
    target.rotation.fromObject(quat);
  }
}
