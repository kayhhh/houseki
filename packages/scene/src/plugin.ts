import { applyCommands, run, WorldBuilder } from "thyseus";

import { assetCleanup } from "./systems/assetCleanup";
import { deepRemove } from "./systems/deepRemove";
import { geometryCleanup } from "./systems/geometryCleanup";
import { keyframeTrackCleanup } from "./systems/keyframeTrackCleanup";
import { updateGlobalTransforms } from "./systems/updateGlobalTransforms";

export function scenePlugin(builder: WorldBuilder) {
  builder.addSystems(
    assetCleanup,
    geometryCleanup,
    keyframeTrackCleanup,
    run(updateGlobalTransforms).first(),
    run(deepRemove).before(applyCommands)
  );
}
