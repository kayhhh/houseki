import { WorldBuilder } from "thyseus";

import { geometryCleanup, textureCleanup } from "./cleanup";
import { AnimationClip, AnimationMixer, KeyframeTrack } from "./components";

export function scenePlugin(builder: WorldBuilder) {
  builder
    .registerComponent(AnimationMixer)
    .registerComponent(AnimationClip)
    .registerComponent(KeyframeTrack)
    .addSystems(geometryCleanup, textureCleanup);
}
