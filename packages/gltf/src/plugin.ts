import { HousekiSchedules } from "@houseki-engine/core";
import { WorldBuilder } from "thyseus";

import { GltfInfo } from "./components";
import { createSubScenes } from "./systems/createSubScenes";
import { exportGltf } from "./systems/exportGltf";
import { importGltf } from "./systems/importGltf";
import { switchSceneView } from "./systems/switchSceneView";

export function gltfPlugin(builder: WorldBuilder) {
  builder
    .registerComponent(GltfInfo)
    .addSystems(importGltf, createSubScenes, switchSceneView)
    .addSystemsToSchedule(HousekiSchedules.PostUpdate, exportGltf);
}
