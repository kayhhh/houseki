import { Engine, LatticeSchedules } from "lattice-engine/core";
import { orbitPlugin } from "lattice-engine/orbit";

import { demoPlugin } from "../../utils/demoPlugin";
import { initScene } from "./systems";

export const world = await Engine.createWorld()
  .addPlugin(demoPlugin)
  .addPlugin(orbitPlugin)
  .addSystemsToSchedule(LatticeSchedules.Startup, initScene)
  .build();
