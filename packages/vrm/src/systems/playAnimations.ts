import { LoopOnce, LoopRepeat } from "three";
import { Entity, Query, Res, struct, SystemRes, With } from "thyseus";

import { Vrm, VrmAnimation } from "../components";
import { VrmStore } from "../resources";

@struct
class LocalStore {
  @struct.f32 declare lastTime: number;
}

export function playAnimations(
  localStore: SystemRes<LocalStore>,
  vrmStore: Res<VrmStore>,
  animations: Query<[Entity, VrmAnimation]>,
  avatars: Query<Entity, With<Vrm>>
) {
  for (const [entity, animation] of animations) {
    const action = vrmStore.actions.get(entity.id);
    if (!action) continue;

    if (animation.play && !action.isRunning()) {
      action.play();
    } else if (!animation.play && action.isRunning()) {
      action.stop();
      action.reset();
    }

    action.setEffectiveTimeScale(animation.speed);
    action.setLoop(animation.loop ? LoopRepeat : LoopOnce, Infinity);
    action.setEffectiveWeight(animation.weight);
  }

  const time = performance.now();
  const delta = (time - localStore.lastTime) / 1000;
  localStore.lastTime = time;

  for (const entity of avatars) {
    const mixer = vrmStore.mixers.get(entity.id);
    if (!mixer) continue;

    mixer.update(delta);
  }
}
