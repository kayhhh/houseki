import { orbitControls } from "@lattice-engine/orbit";
import { run, WorldBuilder } from "thyseus";

import { calcRect } from "./systems/calcRect";
import { clearEvents } from "./systems/clearEvents";
import { createControls } from "./systems/createControls";
import { saveTransforms } from "./systems/saveTransforms";
import { sendEvents } from "./systems/sendEvents";

export function transformPlugin(builder: WorldBuilder) {
  builder.addSystems(
    calcRect,
    ...run.chain(createControls, sendEvents, saveTransforms),
    run(clearEvents).before(orbitControls)
  );
}
