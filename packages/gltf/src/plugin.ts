import { ReddoSchedules } from "@reddo/core";
import { WorldBuilder } from "thyseus";

import { exportGltf } from "./systems/exportGltf";
import { importGltf } from "./systems/importGltf";

export function gltfPlugin(builder: WorldBuilder) {
  builder
    .addSystems(importGltf)
    .addSystemsToSchedule(ReddoSchedules.PreUpdate, exportGltf);
}
