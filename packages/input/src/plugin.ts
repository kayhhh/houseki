import { ReddoSchedules } from "@reddo/core";
import { WorldBuilder } from "thyseus";

import { inputWriter } from "./systems/inputWriter";

export function inputPlugin(builder: WorldBuilder) {
  builder.addSystemsToSchedule(ReddoSchedules.PreUpdate, inputWriter);
}
