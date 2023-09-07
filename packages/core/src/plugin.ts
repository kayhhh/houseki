import { applyCommands, WorldBuilder } from "thyseus";

import { HousekiSchedules } from "./schedules";
import { despawnEntities } from "./systems/despawnEntities";
import { fetchAssets } from "./systems/fetchAssets";
import { initTime } from "./systems/initTime";
import { initWorld } from "./systems/initWorld";
import { runFixedLoop } from "./systems/runFixedLoop";
import { setMainTime } from "./systems/setMainTime";

export function corePlugin(builder: WorldBuilder) {
  builder
    .addSystems(fetchAssets)
    .addSystemsToSchedule(HousekiSchedules.ApplyCommands, applyCommands)
    .addSystemsToSchedule(HousekiSchedules.Destroy, despawnEntities)
    .addSystemsToSchedule(HousekiSchedules.FixedLoop, runFixedLoop)
    .addSystemsToSchedule(HousekiSchedules.PreUpdate, setMainTime)
    .addSystemsToSchedule(HousekiSchedules.Startup, initWorld, initTime);
}
