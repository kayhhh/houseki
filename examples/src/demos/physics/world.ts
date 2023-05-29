import { Engine } from "@lattice-engine/core";
import { inputPlugin } from "@lattice-engine/input";
import { orbitPlugin } from "@lattice-engine/orbit";
import { physicsPlugin } from "@lattice-engine/physics";
import { renderPlugin } from "@lattice-engine/render";
import { scenePlugin } from "@lattice-engine/scene";
import { CoreSchedule } from "thyseus";

import { statsSystem } from "../../components/stats/system";
import { initScene } from "./systems";

export const world = await Engine.createWorld()
  .addPlugin(inputPlugin)
  .addPlugin(scenePlugin)
  .addPlugin(renderPlugin)
  .addPlugin(orbitPlugin)
  .addPlugin(physicsPlugin)
  .addSystemsToSchedule(CoreSchedule.Startup, initScene)
  .addSystems(statsSystem)
  .build();
