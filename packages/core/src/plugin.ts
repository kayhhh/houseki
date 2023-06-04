import { run, WorldBuilder } from "thyseus";

import { LatticeSchedules } from "./schedules";
import { initWorld } from "./systems/initWorld";
import { setFixedTime } from "./systems/setFixedTime";
import { setMainTime } from "./systems/setMainTime";
import { Resource } from "./warehouse/components";

export function corePlugin(builder: WorldBuilder) {
  builder
    .registerComponent(Resource)
    .addSystems(run(setMainTime).first())
    .addSystemsToSchedule(
      LatticeSchedules.FixedUpdate,
      run(setFixedTime).first()
    )
    .addSystemsToSchedule(LatticeSchedules.Startup, run(initWorld).first());
}
