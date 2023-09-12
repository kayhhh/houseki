import { HousekiSchedules } from "@houseki-engine/core";
import { WorldBuilder } from "thyseus";

import { GltfInfo } from "./components";
import { exportGltf } from "./systems/exportGltf";
import { importGltf } from "./systems/importGltf";

export function gltfPlugin(builder: WorldBuilder) {
  builder
    .registerComponent(GltfInfo)
    .addSystems(importGltf)
    .addSystemsToSchedule(HousekiSchedules.PostUpdate, exportGltf);
}
