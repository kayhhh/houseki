import {
  AnimationClip,
  AnimationMixer,
  SceneView,
} from "@houseki-engine/scene";
import {
  AnimationAction,
  AnimationMixer as ThreeAnimationMixer,
  LoopOnce,
  LoopRepeat,
} from "three";
import { Entity, Query, Res, SystemRes, With } from "thyseus";

import { RenderStore } from "../resources";

class LocalStore {
  /**
   * AnimationClip Entity ID -> AnimationAction
   */
  readonly actions = new Map<bigint, AnimationAction>();
}

export function createAnimationMixers(
  renderStore: Res<RenderStore>,
  localStore: SystemRes<LocalStore>,
  mixers: Query<[Entity, SceneView], With<AnimationMixer>>,
  clips: Query<[Entity, AnimationClip]>
) {
  const ids: bigint[] = [];
  const clipIds: bigint[] = [];

  for (const [entity, view] of mixers) {
    const rootObj = renderStore.scenes.get(view.active);
    if (!rootObj) continue;

    ids.push(entity.id);

    let mixer = renderStore.animationMixers.get(entity.id);

    // Create new objects
    if (!mixer || mixer.getRoot() !== rootObj) {
      // Remove old object
      if (mixer) {
        mixer.stopAllAction();

        localStore.actions.forEach((action) => {
          if (action.getMixer() === mixer) {
            mixer.uncacheAction(action.getClip());
          }
        });

        mixer.uncacheRoot(rootObj);
      }

      mixer = new ThreeAnimationMixer(rootObj);
      renderStore.animationMixers.set(entity.id, mixer);
    }

    // Sync clip actions
    for (const [clipEntity, clip] of clips) {
      if (clip.mixerId !== entity.id) continue;

      clipIds.push(clipEntity.id);

      const clipObject = renderStore.animationClips.get(clipEntity.id);
      if (!clipObject) continue;

      let action = localStore.actions.get(clipEntity.id);

      if (!action) {
        action = mixer.clipAction(clipObject);
        localStore.actions.set(clipEntity.id, action);
      }

      action.loop = clip.loop ? LoopRepeat : LoopOnce;

      if (clip.play && !action.isRunning()) {
        action.play();
      } else if (!clip.play && action.isRunning()) {
        action.stop();
      }
    }
  }

  // Remove old objects
  for (const id of renderStore.animationMixers.keys()) {
    if (!ids.includes(id)) {
      const object = renderStore.animationMixers.get(id);
      if (object) {
        object.stopAllAction();
      }
      renderStore.animationMixers.delete(id);
    }
  }

  // Remove old actions
  for (const id of localStore.actions.keys()) {
    if (!clipIds.includes(id)) {
      const action = localStore.actions.get(id);
      if (action) {
        action.stop();
        action.getMixer().uncacheAction(action.getClip());
      }
      localStore.actions.delete(id);
    }
  }
}
