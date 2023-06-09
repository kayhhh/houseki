import { AnimationMixer } from "@lattice-engine/scene";
import { Commands } from "thyseus";

import { ImportContext } from "./context";

export function removeGltf(context: ImportContext, commands: Commands) {
  const despawned = new Set<bigint>();

  for (const [, id] of context.nodes) {
    if (despawned.has(id)) continue;
    commands.despawn(id);
    despawned.add(id);
  }

  for (const id of context.meshes) {
    if (despawned.has(id)) continue;
    commands.despawn(id);
    despawned.add(id);
  }

  for (const id of context.materials) {
    if (despawned.has(id)) continue;
    commands.despawn(id);
    despawned.add(id);
  }

  for (const id of context.textures) {
    if (despawned.has(id)) continue;
    commands.despawn(id);
    despawned.add(id);
  }

  for (const id of context.animationClips) {
    if (despawned.has(id)) continue;
    commands.despawn(id);
    despawned.add(id);
  }

  for (const id of context.animationMixers) {
    commands.removeFrom(id, AnimationMixer);
  }

  for (const id of context.keyframeTracks) {
    if (despawned.has(id)) continue;
    commands.despawn(id);
    despawned.add(id);
  }
}
