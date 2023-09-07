import { HousekiSchedules } from "@houseki-engine/core";
import { WorldBuilder } from "thyseus";

import { deepRemove } from "./systems/deepRemove";
import { updateGlobalTransforms } from "./systems/updateGlobalTransforms";

export function scenePlugin(builder: WorldBuilder) {
  builder
    .addSystems(deepRemove)
    .addSystemsToSchedule(HousekiSchedules.PreUpdate, updateGlobalTransforms)
    .addSystemsToSchedule(
      HousekiSchedules.PreFixedUpdate,
      updateGlobalTransforms
    );
}
