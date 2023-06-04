import { run, WorldBuilder } from "thyseus";

import { cleanTransforms } from "./systems/cleanTransforms";
import { geometryCleanup } from "./systems/geometryCleanup";
import { imageCleanup } from "./systems/imageCleanup";
import { keyframeTrackCleanup } from "./systems/keyframeTrackCleanup";
import { updateGlobalTransforms } from "./systems/updateGlobalTransforms";

export function scenePlugin(builder: WorldBuilder) {
  builder.addSystems(
    geometryCleanup,
    imageCleanup,
    keyframeTrackCleanup,
    run(updateGlobalTransforms).first(),
    run(cleanTransforms).after(updateGlobalTransforms)
  );
}
