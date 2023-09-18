import { Matrix4, Quaternion, Vector3 } from "three";
import { Entity, Mut, Query, SystemRes, With } from "thyseus";

import {
  GlobalTransform,
  Parent,
  RenderView,
  SceneView,
  Transform,
} from "../components";

const quat = new Quaternion();
const vec3 = new Vector3();
const vec3b = new Vector3();

class LocalStore {
  children = new Map<bigint, bigint[]>();
  transforms = new Map<bigint, Matrix4>();
  globalTransforms = new Map<bigint, Matrix4>();
}

export function updateGlobalTransforms(
  localStore: SystemRes<LocalStore>,
  views: Query<SceneView, With<RenderView>>,
  nodes: Query<[Entity, Parent, Transform]>,
  globals: Query<[Entity, Mut<GlobalTransform>]>
) {
  // Init global transform mats
  for (const [entity, parent, transform] of nodes) {
    const localMat = new Matrix4();
    localStore.transforms.set(entity.id, localMat);
    localStore.globalTransforms.set(entity.id, localMat);

    vec3.set(
      transform.translation.x,
      transform.translation.y,
      transform.translation.z
    );
    quat.set(
      transform.rotation.x,
      transform.rotation.y,
      transform.rotation.z,
      transform.rotation.w
    );
    vec3b.set(transform.scale.x, transform.scale.y, transform.scale.z);

    localMat.compose(vec3, quat, vec3b);

    const children = localStore.children.get(parent.id) ?? [];
    children.push(entity.id);
    localStore.children.set(parent.id, children);
  }

  // Calculate global transforms
  for (const sceneView of views) {
    for (const sceneId of sceneView.scenes) {
      updateTransformRecursive(
        sceneId,
        localStore.children,
        localStore.transforms,
        localStore.globalTransforms
      );
    }
  }

  // Update global transform components
  for (const [entity, globalTransform] of globals) {
    const globalMat = localStore.globalTransforms.get(entity.id);
    if (!globalMat) continue;

    globalMat.decompose(vec3, quat, vec3b);

    globalTransform.translation.fromObject(vec3);
    globalTransform.rotation.fromObject(quat);
    globalTransform.scale.fromObject(vec3b);
  }

  localStore.children.clear();
  localStore.transforms.clear();
  localStore.globalTransforms.clear();
}

function updateTransformRecursive(
  entityId: bigint,
  childrenMap: Map<bigint, bigint[]>,
  transforms: Map<bigint, Matrix4>,
  globalTransforms: Map<bigint, Matrix4>
) {
  const children = childrenMap.get(entityId);
  if (!children) return;

  const parentGlobal = globalTransforms.get(entityId) ?? new Matrix4();

  for (const childId of children) {
    const childLocal = transforms.get(childId);
    const childGlobal = globalTransforms.get(childId);

    if (childGlobal && childLocal) {
      childGlobal.multiplyMatrices(parentGlobal, childLocal);
    }

    updateTransformRecursive(
      childId,
      childrenMap,
      transforms,
      globalTransforms
    );
  }
}
