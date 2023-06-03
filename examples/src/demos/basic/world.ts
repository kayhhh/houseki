import { Engine, LatticeSchedules } from "lattice-engine/core";
import { orbitPlugin } from "lattice-engine/orbit";
import { defaultPlugin } from "lattice-engine/utils";

import { loadingSystem } from "../../components/loading/system";
import { statsSystem } from "../../components/stats/system";
import { initScene } from "./systems";

export const world = await Engine.createWorld()
  .addPlugin(defaultPlugin)
  .addPlugin(orbitPlugin)
  .addSystemsToSchedule(LatticeSchedules.Startup, initScene)
  .addSystems(statsSystem)
  .addSystems(loadingSystem)
  .build();
