import { Engine, LatticeSchedules } from "lattice-engine/core";
import { gltfPlugin } from "lattice-engine/gltf";
import { orbitPlugin } from "lattice-engine/orbit";
import { defaultPlugin } from "lattice-engine/utils";

import { loadingSystem } from "../../components/loading/system";
import { statsSystem } from "../../components/stats/system";
import { initScene, loadGltf } from "./systems";

export const world = await Engine.createWorld()
  .addPlugin(defaultPlugin)
  .addPlugin(gltfPlugin)
  .addPlugin(orbitPlugin)
  .addSystemsToSchedule(LatticeSchedules.Startup, initScene)
  .addSystems(loadGltf)
  .addSystems(statsSystem)
  .addSystems(loadingSystem)
  .build();
