import { AnimationMixer } from "@lattice-engine/scene";
import { Commands } from "thyseus";

import { ImportContext } from "./context";

export function removeGltf(context: ImportContext, commands: Commands) {
  for (const [, id] of context.nodes) {
    commands.despawn(id);
  }

  for (const id of context.meshes) {
    commands.despawn(id);
  }

  for (const id of context.materials) {
    commands.despawn(id);
  }

  for (const id of context.textures) {
    commands.despawn(id);
  }

  for (const id of context.animationClips) {
    commands.despawn(id);
  }

  for (const id of context.animationMixers) {
    commands.removeFrom(id, AnimationMixer);
  }

  for (const id of context.keyframeTracks) {
    commands.despawn(id);
  }
}
