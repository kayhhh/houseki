import { applyCommands, WorldBuilder } from "thyseus";

import { HousekiSchedules } from "./schedules";
import { despawnEntities } from "./systems/despawnEntities";
import { fetchAssets } from "./systems/fetchAssets";
import { initTime } from "./systems/initTime";
import { initWorld } from "./systems/initWorld";
import { runFixedUpdate } from "./systems/runFixedUpdate";
import { runMainUpdate } from "./systems/runMainUpdate";

export function corePlugin(builder: WorldBuilder) {
  builder
    .addSystems(fetchAssets)
    .addSystemsToSchedule(HousekiSchedules.ApplyCommands, applyCommands)
    .addSystemsToSchedule(HousekiSchedules.Destroy, despawnEntities)
    .addSystemsToSchedule(HousekiSchedules.RunFixedUpdate, runFixedUpdate)
    .addSystemsToSchedule(HousekiSchedules.RunMainUpdate, runMainUpdate)
    .addSystemsToSchedule(HousekiSchedules.Startup, initWorld, initTime);
}
