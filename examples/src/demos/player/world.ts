import { Engine } from "@lattice-engine/core";
import { inputPlugin } from "@lattice-engine/input";
import { physicsPlugin } from "@lattice-engine/physics";
import { playerPlugin } from "@lattice-engine/player";
import { renderPlugin } from "@lattice-engine/render";
import { scenePlugin } from "@lattice-engine/scene";
import { CoreSchedule } from "thyseus";

import { initScene } from "./systems";

export const world = await Engine.createWorld()
  .addPlugin(inputPlugin)
  .addPlugin(scenePlugin)
  .addPlugin(renderPlugin)
  .addPlugin(physicsPlugin)
  .addPlugin(playerPlugin)
  .addSystemsToSchedule(CoreSchedule.Startup, initScene)
  .build();