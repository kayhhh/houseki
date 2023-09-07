import { applyCommands, WorldBuilder } from "thyseus";

import { ReddoSchedules } from "./schedules";
import { despawnEntities } from "./systems/despawnEntities";
import { fetchAssets } from "./systems/fetchAssets";
import { initTime } from "./systems/initTime";
import { initWorld } from "./systems/initWorld";
import { runFixedLoop } from "./systems/runFixedLoop";
import { setMainTime } from "./systems/setMainTime";

export function corePlugin(builder: WorldBuilder) {
  builder
    .addSystems(fetchAssets)
    .addSystemsToSchedule(ReddoSchedules.ApplyCommands, applyCommands)
    .addSystemsToSchedule(ReddoSchedules.Destroy, despawnEntities)
    .addSystemsToSchedule(ReddoSchedules.FixedLoop, runFixedLoop)
    .addSystemsToSchedule(ReddoSchedules.PreUpdate, setMainTime)
    .addSystemsToSchedule(ReddoSchedules.Startup, initWorld, initTime);
}
