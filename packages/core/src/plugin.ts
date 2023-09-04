import { applyCommands, WorldBuilder } from "thyseus";

import { LatticeSchedules } from "./schedules";
import { despawnEntities } from "./systems/despawnEntities";
import { fetchAssets } from "./systems/fetchAssets";
import { initTime } from "./systems/initTime";
import { initWorld } from "./systems/initWorld";
import { runFixedLoop } from "./systems/runFixedLoop";
import { setMainTime } from "./systems/setMainTime";

export function corePlugin(builder: WorldBuilder) {
  builder
    .addSystems(fetchAssets)
    .addSystemsToSchedule(LatticeSchedules.ApplyCommands, applyCommands)
    .addSystemsToSchedule(LatticeSchedules.Destroy, despawnEntities)
    .addSystemsToSchedule(LatticeSchedules.FixedLoop, runFixedLoop)
    .addSystemsToSchedule(LatticeSchedules.PreUpdate, setMainTime)
    .addSystemsToSchedule(LatticeSchedules.Startup, initWorld, initTime);
}
