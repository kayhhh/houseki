import { LatticeSchedules } from "@lattice-engine/core";
import { WorldBuilder } from "thyseus";

import { exportGlb } from "./systems/exportGltf";
import { importGltf } from "./systems/importGltf";

export function gltfPlugin(builder: WorldBuilder) {
  builder
    .addSystems(importGltf)
    .addSystemsToSchedule(LatticeSchedules.PreUpdate, exportGlb);
}
