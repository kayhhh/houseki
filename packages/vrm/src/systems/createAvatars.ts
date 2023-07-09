import { Loading } from "@lattice-engine/core";
import { VRM, VRMLoaderPlugin, VRMUtils } from "@pixiv/three-vrm";
import { Mesh } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import {
  Commands,
  dropStruct,
  Entity,
  Query,
  Res,
  SystemRes,
  With,
  Without,
} from "thyseus";

import { Vrm } from "../components";
import { VrmStore } from "../resources";

class LocalStore {
  /**
   * Entity ID -> URI being loaded
   */
  readonly loadingURI = new Map<bigint, string>();

  /**
   * Entity ID -> VRM
   */
  readonly loaded = new Map<bigint, VRM>();
}

/**
 * Adds VRM models to the scene.
 */
export function createAvatars(
  commands: Commands,
  vrmStore: Res<VrmStore>,
  localStore: SystemRes<LocalStore>,
  toLoad: Query<[Entity, Vrm], Without<Loading>>,
  loading: Query<Entity, With<[Vrm, Loading]>>,
) {
  const ids: bigint[] = [];

  for (const [entity, vrm] of toLoad) {
    ids.push(entity.id);

    const entityId = entity.id;
    const uri = vrm.uri;

    // If the VRM uri hasn't changed, skip
    if (localStore.loadingURI.get(entityId) === uri) continue;

    // Remove the old VRM
    removeVrm(entityId, localStore, vrmStore);

    if (!uri) continue;

    // Load the new VRM
    localStore.loadingURI.set(entityId, uri);

    const loadMessage = new Loading(`Loading ${uri}`);
    commands.getById(entity.id).add(loadMessage);
    dropStruct(loadMessage);

    loadVrm(entityId, uri, localStore);
  }

  for (const entity of loading) {
    ids.push(entity.id);

    const loaded = localStore.loaded.get(entity.id);

    if (loaded) {
      // VRM is loaded, remove loading component
      commands.getById(entity.id).remove(Loading);
      vrmStore.avatars.set(entity.id, loaded);
    }
  }

  // Remove old avatars
  for (const id of localStore.loadingURI.keys()) {
    if (!ids.includes(id)) {
      removeVrm(id, localStore, vrmStore);
    }
  }
}

/**
 * Load a VRM model into the local store.
 */
async function loadVrm(entityId: bigint, uri: string, localStore: LocalStore) {
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

  localStore.loaded.set(entityId, vrm);
}

/**
 * Remove a VRM model from the local store and the scene.
 */
function removeVrm(
  entityId: bigint,
  localStore: LocalStore,
  vrmStore: VrmStore,
) {
  const vrm = vrmStore.avatars.get(entityId);
  if (vrm) {
    vrm.scene.removeFromParent();
    VRMUtils.deepDispose(vrm.scene);
  }

  localStore.loadingURI.delete(entityId);
  localStore.loaded.delete(entityId);
  vrmStore.avatars.delete(entityId);
}
