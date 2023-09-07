import { ReddoSchedules } from "@reddo/core";
import { WorldBuilder } from "thyseus";

import { deepRemove } from "./systems/deepRemove";
import { updateGlobalTransforms } from "./systems/updateGlobalTransforms";

export function scenePlugin(builder: WorldBuilder) {
  builder
    .addSystems(deepRemove)
    .addSystemsToSchedule(ReddoSchedules.PreUpdate, updateGlobalTransforms)
    .addSystemsToSchedule(
      ReddoSchedules.PreFixedUpdate,
      updateGlobalTransforms
    );
}
