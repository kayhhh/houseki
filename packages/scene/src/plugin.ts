import { LatticeSchedules } from "@lattice-engine/core";
import { WorldBuilder } from "thyseus";

import { deepRemove } from "./systems/deepRemove";
import { updateGlobalTransforms } from "./systems/updateGlobalTransforms";

export function scenePlugin(builder: WorldBuilder) {
  builder
    .addSystems(deepRemove)
    .addSystemsToSchedule(LatticeSchedules.PreUpdate, updateGlobalTransforms)
    .addSystemsToSchedule(
      LatticeSchedules.PreFixedUpdate,
      updateGlobalTransforms
    );
}
