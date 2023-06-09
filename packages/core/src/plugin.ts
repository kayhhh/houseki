import { applyCommands, run, WorldBuilder } from "thyseus";

import { LatticeSchedules } from "./schedules";
import { despawnEntities } from "./systems/despawnEntities";
import { fetchAssets } from "./systems/fetchAssets";
import { initWorld } from "./systems/initWorld";
import { setFixedTime } from "./systems/setFixedTime";
import { setMainTime } from "./systems/setMainTime";
import { Resource } from "./warehouse/components";

export function corePlugin(builder: WorldBuilder) {
  builder
    .registerComponent(Resource)
    .addSystems(
      run(setMainTime).first(),
      fetchAssets,
      run(applyCommands).last()
    )
    .addSystemsToSchedule(
      LatticeSchedules.FixedUpdate,
      run(setFixedTime).first(),
      run(applyCommands).last()
    )
    .addSystemsToSchedule(
      LatticeSchedules.Startup,
      run(initWorld).first(),
      run(applyCommands).last()
    )
    .addSystemsToSchedule(
      LatticeSchedules.Destroy,
      despawnEntities,
      run(applyCommands).last()
    );
}
