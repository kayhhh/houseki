import { Loading } from "@lattice-engine/core";
import { RenderStore } from "@lattice-engine/render";
import { VRM, VRMLoaderPlugin, VRMUtils } from "@pixiv/three-vrm";
import { Mesh } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Entity, Query, Res, SystemRes } from "thyseus";

import { Vrm } from "../components";
import { FIRSTPERSON_ONLY_LAYER, THIRDPERSON_ONLY_LAYER } from "../constants";
import { VrmStore } from "../resources";

class LocalStore {
  lastTime = 0;

  /**
   * Entity ID -> Vrm URI
   */
  readonly loaded = new Map<bigint, string>();

  /**
   * Entity ID -> loadVrm promise
   */
  readonly loading = new Map<bigint, Promise<void>>();
}

/**
 * Adds VRM models to the scene.
 */
export function createAvatars(
  renderStore: Res<RenderStore>,
  vrmStore: Res<VrmStore>,
  localStore: SystemRes<LocalStore>,
  avatars: Query<[Entity, Vrm]>
) {
  // Update delta
  const time = performance.now();
  const delta = (time - localStore.lastTime) / 1000;
  localStore.lastTime = time;

  const ids: bigint[] = [];

  for (const [entity, vrm] of avatars) {
    ids.push(entity.id);

    const object = vrmStore.avatars.get(entity.id);

    if (object) {
      if (localStore.loading.has(entity.id)) {
        // VRM is loaded, remove loading component
        if (entity.hasComponent(Loading)) entity.remove(Loading);
        localStore.loading.delete(entity.id);
      }

      object.update(delta);

      // Add to scene
      const node = renderStore.nodes.get(entity.id);
      if (node) node.add(object.scene);

      // Setup first person layers
      if (vrm.setupFirstPerson) {
        object.firstPerson?.setup({
          firstPersonOnlyLayer: FIRSTPERSON_ONLY_LAYER,
          thirdPersonOnlyLayer: THIRDPERSON_ONLY_LAYER,
        });
      }
    }

    // If the VRM uri hasn't changed, skip
    if (localStore.loaded.get(entity.id) === vrm.uri) continue;

    // If the VRM is loading, wait for it to finish
    if (localStore.loading.has(entity.id)) continue;

    entity.add(new Loading(`Loading ${vrm.uri}`));

    // Remove the old VRM
    removeVrm(entity.id, localStore, vrmStore);

    // Load the new VRM
    localStore.loaded.set(entity.id, vrm.uri);
    const promise = loadVrm(entity.id, vrm.uri, vrmStore);
    localStore.loading.set(entity.id, promise);
  }

  // Remove old avatars
  for (const id of localStore.loaded.keys()) {
    if (!ids.includes(id)) {
      removeVrm(id, localStore, vrmStore);
    }
  }
}

/**
 * Load a VRM model into the local store.
 */
async function loadVrm(entityId: bigint, uri: string, vrmStore: VrmStore) {
  const loader = new GLTFLoader();
  loader.setCrossOrigin("anonymous");
  loader.register((parser) => new VRMLoaderPlugin(parser));

  const gltf = await loader.loadAsync(uri);

  const vrm = gltf.userData.vrm as VRM;
  vrm.scene.rotateY(Math.PI);

  VRMUtils.removeUnnecessaryVertices(vrm.scene);
  VRMUtils.removeUnnecessaryJoints(vrm.scene);
  VRMUtils.rotateVRM0(vrm);

  vrm.scene.traverse((object) => {
    if (object instanceof Mesh) object.castShadow = true;
  });

  vrmStore.avatars.set(entityId, vrm);
}

/**
 * Remove a VRM model from the local store and the scene.
 */
function removeVrm(
  entityId: bigint,
  localStore: LocalStore,
  vrmStore: VrmStore
) {
  // If the VRM is loading, wait for it to finish
  const promise = localStore.loading.get(entityId);
  if (promise) {
    promise.then(() => removeVrm(entityId, localStore, vrmStore));
    return;
  }

  const vrm = vrmStore.avatars.get(entityId);
  if (vrm) {
    vrm.scene.removeFromParent();
    VRMUtils.deepDispose(vrm.scene);
  }

  localStore.loaded.delete(entityId);
  localStore.loading.delete(entityId);
  vrmStore.avatars.delete(entityId);
}
