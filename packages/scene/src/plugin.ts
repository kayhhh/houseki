import { run, WorldBuilder } from "thyseus";

import {
  geometryCleanup,
  keyframeTrackCleanup,
  textureCleanup,
} from "./cleanup";
import { updateGlobalTransforms } from "./systems/updateGlobalTransforms";

export function scenePlugin(builder: WorldBuilder) {
  builder.addSystems(
    geometryCleanup,
    textureCleanup,
    keyframeTrackCleanup,
    run(updateGlobalTransforms).first()
  );
}
