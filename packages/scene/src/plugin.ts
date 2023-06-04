import { run, WorldBuilder } from "thyseus";

import { assetCleanup } from "./systems/assetCleanup";
import { cleanTransforms } from "./systems/cleanTransforms";
import { geometryCleanup } from "./systems/geometryCleanup";
import { keyframeTrackCleanup } from "./systems/keyframeTrackCleanup";
import { updateGlobalTransforms } from "./systems/updateGlobalTransforms";

export function scenePlugin(builder: WorldBuilder) {
  builder.addSystems(
    geometryCleanup,
    assetCleanup,
    keyframeTrackCleanup,
    run(updateGlobalTransforms).first(),
    run(cleanTransforms).after(updateGlobalTransforms)
  );
}
