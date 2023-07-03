import { AnimationMixer } from "three";
import { Entity, Query, Res, SystemRes, With } from "thyseus";

import { Vrm, VrmAnimation } from "../components";
import { VrmStore } from "../resources";
import { loadMixamoAnimation } from "../utils/loadMixamoAnimation";

class LocalStore {
  /**
   * VrmAnimation Entity ID -> Loading Promise
   */
  readonly promises = new Map<bigint, Promise<void>>();

  /**
   * VrmAnimation Entity ID -> Loaded URI
   */
  readonly loaded = new Map<bigint, string>();

  /**
   * Loading Entity IDs to be removed
   */
  readonly doneLoading = new Set<bigint>();
}

/**
 * Loads FBX animations and applies them to VRMs.
 */
export function createAnimations(
  localStore: SystemRes<LocalStore>,
  vrmStore: Res<VrmStore>,
  vrms: Query<Entity, With<Vrm>>,
  animations: Query<[Entity, VrmAnimation]>
) {
  const ids: bigint[] = [];

  for (const entity of vrms) {
    const object = vrmStore.avatars.get(entity.id);
    if (!object) continue;

    let mixer = vrmStore.mixers.get(entity.id);

    if (!mixer || mixer.getRoot() !== object.scene) {
      if (mixer) mixer.stopAllAction();

      mixer = new AnimationMixer(object.scene);
      vrmStore.mixers.set(entity.id, mixer);
    }

    for (const [animationEntity, animation] of animations) {
      if (localStore.doneLoading.has(animationEntity.id)) {
        localStore.doneLoading.delete(animationEntity.id);
      }

      if (animation.vrmId !== entity.id) continue;

      ids.push(animationEntity.id);

      if (localStore.promises.has(animationEntity.id)) continue;
      if (localStore.loaded.get(animationEntity.id) === animation.uri) continue;

      vrmStore.actions.delete(animationEntity.id);

      if (!animation.uri) continue;

      const uri = animation.uri;
      const animationId = animationEntity.id;

      const promise = loadMixamoAnimation(uri, object).then((clips) => {
        localStore.loaded.set(animationId, uri);
        localStore.promises.delete(animationId);
        localStore.doneLoading.add(animationId);

        const clip = clips[0];
        if (!clip || !mixer) return;

        const action = mixer.clipAction(clip);
        vrmStore.actions.set(animationId, action);
      });

      localStore.promises.set(animationId, promise);
    }
  }

  // Remove old animations
  for (const loadedId of localStore.loaded.keys()) {
    if (!ids.includes(loadedId)) {
      const action = vrmStore.actions.get(loadedId);

      if (action) {
        action.stop();
        action.getMixer().uncacheAction(action.getClip());
        vrmStore.actions.delete(loadedId);
      }

      localStore.loaded.delete(loadedId);
    }
  }
}
