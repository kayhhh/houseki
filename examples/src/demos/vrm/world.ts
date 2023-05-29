import { Engine } from "lattice-engine/core";
import { orbitPlugin } from "lattice-engine/orbit";
import { defaultPlugin } from "lattice-engine/utils";
import { vrmPlugin } from "lattice-engine/vrm";
import { CoreSchedule } from "thyseus";

import { statsSystem } from "../../components/stats/system";
import { initScene } from "./systems";

export const world = await Engine.createWorld()
  .addPlugin(defaultPlugin)
  .addPlugin(orbitPlugin)
  .addPlugin(vrmPlugin)
  .addSystemsToSchedule(CoreSchedule.Startup, initScene)
  .addSystems(statsSystem)
  .build();
