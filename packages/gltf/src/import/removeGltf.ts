import { AnimationMixer } from "@lattice-engine/scene";
import { Commands } from "thyseus";

import { ImportContext } from "./context";

export function removeGltf(context: ImportContext, commands: Commands) {
  const despawned = new Set<bigint>();

  const despawn = (id: bigint) => {
    if (despawned.has(id)) return;
    despawned.add(id);
    commands.despawnById(id);
  };

  for (const [, id] of context.nodes) {
    despawn(id);
  }

  for (const id of context.meshIds) {
    despawn(id);
  }

  for (const id of context.materialIds) {
    despawn(id);
  }

  for (const id of context.textureIds) {
    despawn(id);
  }

  for (const id of context.animationClipIds) {
    despawn(id);
  }

  for (const id of context.animationMixerIds) {
    commands.getById(id).remove(AnimationMixer);
  }

  for (const id of context.keyframeTrackIds) {
    despawn(id);
  }
}
