import { applyCommands, WorldBuilder } from "thyseus";

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
    .addSystems(fetchAssets)
    .addSystemsToSchedule(LatticeSchedules.Startup, initWorld)
    .addSystemsToSchedule(LatticeSchedules.PreUpdate, setMainTime)
    .addSystemsToSchedule(LatticeSchedules.PreFixedUpdate, setFixedTime)
    .addSystemsToSchedule(LatticeSchedules.ApplyCommands, applyCommands)
    .addSystemsToSchedule(LatticeSchedules.Destroy, despawnEntities);
}
