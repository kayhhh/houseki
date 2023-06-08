import { Engine, LatticeSchedules } from "lattice-engine/core";
import { orbitPlugin } from "lattice-engine/orbit";
import { textPlugin } from "lattice-engine/text";

import { demoPlugin } from "../../utils/demoPlugin";
import { initScene } from "./systems";

export const world = await Engine.createWorld()
  .addPlugin(demoPlugin)
  .addPlugin(orbitPlugin)
  .addPlugin(textPlugin)
  .addSystemsToSchedule(LatticeSchedules.Startup, initScene)
  .build();
