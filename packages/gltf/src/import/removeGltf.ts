import { AnimationMixer } from "@reddo/scene";
import { Commands } from "thyseus";

import { ImportContext } from "./context";

export function removeGltf(context: ImportContext, commands: Commands) {
  for (const [, id] of context.nodes) {
    commands.despawnById(id);
  }

  for (const id of context.meshIds) {
    commands.despawnById(id);
  }

  for (const id of context.materialIds) {
    commands.despawnById(id);
  }

  for (const id of context.textureIds) {
    commands.despawnById(id);
  }

  for (const id of context.animationClipIds) {
    commands.despawnById(id);
  }

  for (const id of context.animationMixerIds) {
    commands.getById(id).remove(AnimationMixer);
  }

  for (const id of context.keyframeTrackIds) {
    commands.despawnById(id);
  }
}
