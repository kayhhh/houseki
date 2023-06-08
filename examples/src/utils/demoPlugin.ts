import { gltfPlugin } from "lattice-engine/gltf";
import { defaultPlugin } from "lattice-engine/utils";
import { WorldBuilder } from "thyseus";

import { loadingSystem } from "../components/loading/system";
import { statsSystem } from "../components/stats/system";
import { downloadExports } from "./downloadExports";

export function demoPlugin(builder: WorldBuilder) {
  builder
    .addPlugin(defaultPlugin)
    .addPlugin(gltfPlugin)
    .addSystems(statsSystem)
    .addSystems(loadingSystem)
    .addSystems(downloadExports);
}
