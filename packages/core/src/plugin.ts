import { applyCommands, WorldBuilder } from "thyseus";

import { LatticeSchedules } from "./schedules";
import { despawnEntities } from "./systems/despawnEntities";
import { fetchAssets } from "./systems/fetchAssets";
import { initWorld } from "./systems/initWorld";
import { runFixedLoop } from "./systems/runFixedLoop";
import { setMainTime } from "./systems/setMainTime";
import { Resource } from "./warehouse/components";

export function corePlugin(builder: WorldBuilder) {
  builder
    .registerComponent(Resource)
    .addSystems(fetchAssets)
    .addSystemsToSchedule(LatticeSchedules.ApplyCommands, applyCommands)
    .addSystemsToSchedule(LatticeSchedules.Destroy, despawnEntities)
    .addSystemsToSchedule(LatticeSchedules.FixedLoop, runFixedLoop)
    .addSystemsToSchedule(LatticeSchedules.PreUpdate, setMainTime)
    .addSystemsToSchedule(LatticeSchedules.Startup, initWorld);
}
