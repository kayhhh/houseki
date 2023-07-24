import { sendEvents as orbitEvents } from "@lattice-engine/orbit";
import { rotateCamera as playerEvents } from "@lattice-engine/player";
import { run, System, WorldBuilder } from "thyseus";

import { calcRect } from "./systems/calcRect";
import { clearEvents } from "./systems/clearEvents";
import { createControls } from "./systems/createControls";
import { saveTransforms } from "./systems/saveTransforms";
import { selectTarget } from "./systems/selectTarget";
import { sendEvents } from "./systems/sendEvents";
import { setOutlineTargets } from "./systems/setOutlineTargets";

/**
 * @param orbitControls - Whether orbit controls are used.
 * @param playerControls - Whether player controls are used.
 */
export function getTransformPlugin({
  orbitControls = false,
  playerControls = false,
}) {
  const beforeEvents: System[] = [];

  if (orbitControls) {
    beforeEvents.push(orbitEvents);
  }

  if (playerControls) {
    beforeEvents.push(playerEvents);
  }

  return function transformPlugin(builder: WorldBuilder) {
    builder.addSystems(
      calcRect,
      ...run.chain(
        createControls,
        sendEvents,
        saveTransforms,
        selectTarget,
        setOutlineTargets
      ),
      run(clearEvents).after(sendEvents).before(beforeEvents)
    );
  };
}
