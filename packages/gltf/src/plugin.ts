import { HousekiSchedules } from "@houseki-engine/core";
import { WorldBuilder } from "thyseus";

import { createSubScenes } from "./systems/createSubScenes";
import { exportGltf } from "./systems/exportGltf";
import { importGltf } from "./systems/importGltf";
import { switchSceneView } from "./systems/switchSceneView";

export function gltfPlugin(builder: WorldBuilder) {
  builder
    .addSystems(importGltf, createSubScenes, switchSceneView)
    .addSystemsToSchedule(HousekiSchedules.PostUpdate, exportGltf);
}
