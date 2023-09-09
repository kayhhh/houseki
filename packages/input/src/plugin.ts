import { HousekiSchedules } from "@houseki-engine/core";
import { WorldBuilder } from "thyseus";

import { inputWriter } from "./systems/inputWriter";

export function inputPlugin(builder: WorldBuilder) {
  builder.addSystemsToSchedule(HousekiSchedules.PreLoop, inputWriter);
}
