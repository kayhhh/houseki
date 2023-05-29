import { Engine } from "@lattice-engine/core";
import { inputPlugin } from "@lattice-engine/input";
import { physicsPlugin } from "@lattice-engine/physics";
import { playerPlugin } from "@lattice-engine/player";
import { renderPlugin } from "@lattice-engine/render";
import { scenePlugin } from "@lattice-engine/scene";
import { vrmPlugin } from "@lattice-engine/vrm";
import { CoreSchedule } from "thyseus";

import { statsSystem } from "../../components/stats/system";
import { initScene } from "./systems";

export const world = await Engine.createWorld()
  .addPlugin(inputPlugin)
  .addPlugin(scenePlugin)
  .addPlugin(renderPlugin)
  .addPlugin(physicsPlugin)
  .addPlugin(playerPlugin)
  .addPlugin(vrmPlugin)
  .addSystemsToSchedule(CoreSchedule.Startup, initScene)
  .addSystems(statsSystem)
  .build();
