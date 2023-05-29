import { WorldBuilder } from "thyseus";

import {
  geometryCleanup,
  keyframeTrackCleanup,
  textureCleanup,
} from "./cleanup";

export function scenePlugin(builder: WorldBuilder) {
  builder.addSystems(geometryCleanup, textureCleanup, keyframeTrackCleanup);
}
