import { run, WorldBuilder } from "thyseus";

import { createControls } from "./systems/createControls";
import { saveTransforms } from "./systems/saveTransforms";
import { sendEvents } from "./systems/sendEvents";
import { updateObjects } from "./systems/updateObjects";

export function orbitPlugin(builder: WorldBuilder) {
  builder.addSystems(
    ...run.chain(createControls, sendEvents, updateObjects, saveTransforms),
  );
}
