import { HousekiSchedules } from "@houseki-engine/core";
import { sendEvents as orbitEvents } from "@houseki-engine/orbit";
import { applyTargetTransforms } from "@houseki-engine/physics";
import { rotateCamera as playerEvents } from "@houseki-engine/player";
import { run, System, WorldBuilder } from "thyseus";

import { saveTargetTransforms } from "./systems";
import { calcRect } from "./systems/calcRect";
import { clearEvents } from "./systems/clearEvents";
import { createControls } from "./systems/createControls";
import { saveDragging } from "./systems/saveDragging";
import { saveTransforms } from "./systems/saveTransforms";
import { selectTarget } from "./systems/selectTarget";
import { sendEvents } from "./systems/sendEvents";
import { setOutlineTargets } from "./systems/setOutlineTargets";

/**
 * @param orbitControls - Whether orbit controls are used.
 * @param playerControls - Whether player controls are used.
 * @param physics - Whether physics are used.
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
    builder
      .addSystemsToSchedule(
        HousekiSchedules.PreUpdate,
        run(saveTargetTransforms).before(applyTargetTransforms)
      )
      .addSystems(
        calcRect,
        ...run.chain(
          selectTarget,
          createControls,
          saveDragging,
          sendEvents,
          saveTransforms,
          setOutlineTargets
        ),
        run(clearEvents).after(sendEvents).before(beforeEvents)
      );
  };
}
