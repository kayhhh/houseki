import { Mat4, Quat, Vec3, Vec4 } from "gl-matrix/dist/esm";
import { Entity, Mut, Query, With } from "thyseus";

import { GlobalTransform, Parent, Scene, Transform } from "../components";

const childrenMap = new Map<bigint, bigint[]>();
const transforms = new Map<bigint, Mat4>();
const globalTransforms = new Map<bigint, Mat4>();

const quat = new Quat();
const vec3 = new Vec3();
const vec3b = new Vec3();
const vec4 = new Vec4();

export function updateGlobalTransforms(
  scenes: Query<Entity, With<Scene>>,
  nodes: Query<[Entity, Parent, Transform, Mut<GlobalTransform>]>
) {
  for (const [entity, parent, transform] of nodes) {
    const localMat = new Mat4();
    transforms.set(entity.id, localMat);

    vec4.x = transform.rotation.x;
    vec4.y = transform.rotation.y;
    vec4.z = transform.rotation.z;
    vec4.w = transform.rotation.w;

    vec3.x = transform.translation.x;
    vec3.y = transform.translation.y;
    vec3.z = transform.translation.z;

    vec3b.x = transform.scale.x;
    vec3b.y = transform.scale.y;
    vec3b.z = transform.scale.z;

    Mat4.fromRotationTranslationScale(localMat, vec4, vec3, vec3b);

    globalTransforms.set(entity.id, localMat);

    const children = childrenMap.get(parent.id) ?? [];
    children.push(entity.id);
    childrenMap.set(parent.id, children);
  }

  for (const entity of scenes) {
    updateTransformRecursive(
      entity.id,
      childrenMap,
      transforms,
      globalTransforms
    );
  }

  for (const [entity, , , globalTransform] of nodes) {
    const globalMat = globalTransforms.get(entity.id);
    if (!globalMat) continue;

    Mat4.getRotation(quat, globalMat);
    globalTransform.rotation.fromObject(quat);

    Mat4.getTranslation(vec3, globalMat);
    globalTransform.translation.fromObject(vec3);

    Mat4.getScaling(vec3, globalMat);
    globalTransform.scale.fromObject(vec3);
  }

  childrenMap.clear();
  transforms.clear();
  globalTransforms.clear();
}

function updateTransformRecursive(
  entityId: bigint,
  childrenMap: Map<bigint, bigint[]>,
  transforms: Map<bigint, Mat4>,
  globalTransforms: Map<bigint, Mat4>
) {
  const children = childrenMap.get(entityId);
  if (!children) return;

  const parentGlobal = globalTransforms.get(entityId) ?? new Mat4();

  for (const childId of children) {
    const childLocal = transforms.get(childId);
    if (!childLocal) continue;

    const childGlobal = globalTransforms.get(childId);
    if (!childGlobal) continue;

    Mat4.multiply(childGlobal, parentGlobal, childLocal);

    updateTransformRecursive(
      childId,
      childrenMap,
      transforms,
      globalTransforms
    );
  }
}
