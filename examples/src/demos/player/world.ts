import { Engine } from "lattice-engine/core";
import { physicsPlugin } from "lattice-engine/physics";
import { playerPlugin } from "lattice-engine/player";
import { defaultPlugin } from "lattice-engine/utils";
import { vrmPlugin } from "lattice-engine/vrm";
import { CoreSchedule } from "thyseus";

import { statsSystem } from "../../components/stats/system";
import { initScene } from "./systems";

export const world = await Engine.createWorld()
  .addPlugin(defaultPlugin)
  .addPlugin(physicsPlugin)
  .addPlugin(playerPlugin)
  .addPlugin(vrmPlugin)
  .addSystemsToSchedule(CoreSchedule.Startup, initScene)
  .addSystems(statsSystem)
  .build();
