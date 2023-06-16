import { LatticeSchedules } from "@lattice-engine/core";
import { WorldBuilder } from "thyseus";

import { inputWriter } from "./systems/inputWriter";

export function inputPlugin(builder: WorldBuilder) {
  builder.addSystemsToSchedule(LatticeSchedules.PreUpdate, inputWriter);
}
