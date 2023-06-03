import { Engine, LatticeSchedules } from "lattice-engine/core";
import { orbitPlugin } from "lattice-engine/orbit";
import { physicsPlugin } from "lattice-engine/physics";
import { defaultPlugin } from "lattice-engine/utils";

import { loadingSystem } from "../../components/loading/system";
import { statsSystem } from "../../components/stats/system";
import { initScene } from "./systems";

export const world = await Engine.createWorld()
  .addPlugin(defaultPlugin)
  .addPlugin(orbitPlugin)
  .addPlugin(physicsPlugin)
  .addSystemsToSchedule(LatticeSchedules.Startup, initScene)
  .addSystems(statsSystem)
  .addSystems(loadingSystem)
  .build();
