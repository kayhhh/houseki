import { run, WorldBuilder } from "thyseus";

import { cleanTransforms } from "./systems/cleanTransforms";
import { geometryCleanup } from "./systems/geometryCleanup";
import { keyframeTrackCleanup } from "./systems/keyframeTrackCleanup";
import { textureCleanup } from "./systems/textureCleanup";
import { updateGlobalTransforms } from "./systems/updateGlobalTransforms";

export function scenePlugin(builder: WorldBuilder) {
  builder.addSystems(
    geometryCleanup,
    textureCleanup,
    keyframeTrackCleanup,
    run(updateGlobalTransforms).first(),
    run(cleanTransforms).after(updateGlobalTransforms)
  );
}
