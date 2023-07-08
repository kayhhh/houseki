import { sendEvents as orbitSendEvents } from "@lattice-engine/orbit";
import { run, WorldBuilder } from "thyseus";

import { calcRect } from "./systems/calcRect";
import { clearEvents } from "./systems/clearEvents";
import { createControls } from "./systems/createControls";
import { saveTransforms } from "./systems/saveTransforms";
import { selectTarget } from "./systems/selectTarget";
import { sendEvents } from "./systems/sendEvents";
import { setOutlineTargets } from "./systems/setOutlineTargets";

export function transformPlugin(builder: WorldBuilder) {
  builder.addSystems(
    calcRect,
    ...run.chain(
      createControls,
      sendEvents,
      saveTransforms,
      selectTarget,
      setOutlineTargets
    ),
    run(clearEvents).before(orbitSendEvents)
  );
}
