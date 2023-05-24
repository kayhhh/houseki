import { AnimationMixer } from "@lattice-engine/scene";
import { Entity, Query, Res, SystemRes, With } from "thyseus";

import { RenderStore } from "../RenderStore";

class LocalStore {
  lastTime = 0;
}

export function playAnimations(
  renderStore: Res<RenderStore>,
  localStore: SystemRes<LocalStore>,
  entities: Query<Entity, With<AnimationMixer>>
) {
  const time = performance.now();
  const delta = (time - localStore.lastTime) / 1000;
  localStore.lastTime = time;

  for (const entity of entities) {
    const mixer = renderStore.animationMixers.get(entity.id);
    if (!mixer) continue;

    mixer.update(delta);
  }
}
