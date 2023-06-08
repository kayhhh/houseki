import { Engine, LatticeSchedules } from "lattice-engine/core";
import { n8aoPlugin } from "lattice-engine/n8ao";
import { orbitPlugin } from "lattice-engine/orbit";

import { demoPlugin } from "../../utils/demoPlugin";
import { initScene, loadGltf } from "./systems";

export const world = await Engine.createWorld()
  .addPlugin(demoPlugin)
  .addPlugin(orbitPlugin)
  .addPlugin(n8aoPlugin)
  .addSystemsToSchedule(LatticeSchedules.Startup, initScene)
  .addSystems(loadGltf)
  .build();
