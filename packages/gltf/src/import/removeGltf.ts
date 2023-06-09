import { AnimationMixer } from "@lattice-engine/scene";
import { Commands } from "thyseus";

import { ImportContext } from "./context";

export function removeGltf(context: ImportContext, commands: Commands) {
  const despawned = new Set<bigint>();

  const despawn = (id: bigint) => {
    if (despawned.has(id)) return;
    despawned.add(id);
    commands.despawn(id);
  };

  for (const [, id] of context.nodes) {
    despawn(id);
  }

  for (const id of context.meshes) {
    despawn(id);
  }

  for (const id of context.materials) {
    despawn(id);
  }

  for (const id of context.textures) {
    despawn(id);
  }

  for (const id of context.animationClips) {
    despawn(id);
  }

  for (const id of context.animationMixers) {
    commands.removeFrom(id, AnimationMixer);
  }

  for (const id of context.keyframeTracks) {
    despawn(id);
  }
}
