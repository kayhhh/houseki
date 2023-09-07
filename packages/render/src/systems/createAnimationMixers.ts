import { AnimationClip, AnimationMixer } from "@houseki-engine/scene";
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
  entities: Query<Entity, With<AnimationMixer>>,
  clips: Query<[Entity, AnimationClip]>
) {
  const ids: bigint[] = [];
  const clipIds: bigint[] = [];

  for (const entity of entities) {
    const nodeObject = renderStore.nodes.get(entity.id);
    if (!nodeObject) continue;

    ids.push(entity.id);

    let object = renderStore.animationMixers.get(entity.id);

    // Create new objects
    if (!object || object.getRoot() !== nodeObject) {
      // Remove old object
      if (object) {
        object.stopAllAction();

        localStore.actions.forEach((action) => {
          if (action.getMixer() === object) {
            object.uncacheAction(action.getClip());
          }
        });

        object.uncacheRoot(nodeObject);
      }

      object = new ThreeAnimationMixer(nodeObject);
      renderStore.animationMixers.set(entity.id, object);
    }

    // Sync clip actions
    for (const [clipEntity, clip] of clips) {
      if (clip.mixerId !== entity.id) continue;

      clipIds.push(clipEntity.id);

      const clipObject = renderStore.animationClips.get(clipEntity.id);
      if (!clipObject) continue;

      let action = localStore.actions.get(clipEntity.id);

      if (!action) {
        action = object.clipAction(clipObject);
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
