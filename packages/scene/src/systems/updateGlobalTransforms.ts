import { Mat4, Quat, Vec3, Vec4 } from "gl-matrix/dist/esm";
import { Entity, Mut, Query, SystemRes, With } from "thyseus";

import { GlobalTransform, Parent, Scene, Transform } from "../components";

const quat = new Quat();
const vec3 = new Vec3();
const vec3b = new Vec3();
const vec4 = new Vec4();

class LocalStore {
  children = new Map<bigint, bigint[]>();
  transforms = new Map<bigint, Mat4>();
  globalTransforms = new Map<bigint, Mat4>();
}

export function updateGlobalTransforms(
  localStore: SystemRes<LocalStore>,
  scenes: Query<Entity, With<Scene>>,
  nodes: Query<[Entity, Parent, Transform, Mut<GlobalTransform>]>
) {
  // Init global transform mats
  for (const [entity, parent, transform] of nodes) {
    const localMat = new Mat4();
    localStore.transforms.set(entity.id, localMat);

    Vec4.set(
      vec4,
      transform.rotation.x,
      transform.rotation.y,
      transform.rotation.z,
      transform.rotation.w
    );
    Vec3.set(
      vec3,
      transform.translation.x,
      transform.translation.y,
      transform.translation.z
    );
    Vec3.set(vec3b, transform.scale.x, transform.scale.y, transform.scale.z);

    Mat4.fromRotationTranslationScale(localMat, vec4, vec3, vec3b);

    localStore.globalTransforms.set(entity.id, localMat);

    const children = localStore.children.get(parent.id) ?? [];
    children.push(entity.id);
    localStore.children.set(parent.id, children);
  }

  // Calculate global transforms
  for (const entity of scenes) {
    updateTransformRecursive(
      entity.id,
      localStore.children,
      localStore.transforms,
      localStore.globalTransforms
    );
  }

  // Update global transform components
  for (const [entity, , , globalTransform] of nodes) {
    const globalMat = localStore.globalTransforms.get(entity.id);
    if (!globalMat) continue;

    Mat4.getRotation(quat, globalMat);
    globalTransform.rotation.fromObject(quat);

    Mat4.getTranslation(vec3, globalMat);
    globalTransform.translation.fromObject(vec3);

    Mat4.getScaling(vec3, globalMat);
    globalTransform.scale.fromObject(vec3);
  }

  localStore.children.clear();
  localStore.transforms.clear();
  localStore.globalTransforms.clear();
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
