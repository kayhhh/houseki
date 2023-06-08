import { Engine, LatticeSchedules } from "lattice-engine/core";
import { physicsPlugin } from "lattice-engine/physics";
import { playerPlugin } from "lattice-engine/player";
import { vrmPlugin } from "lattice-engine/vrm";

import { demoPlugin } from "../../utils/demoPlugin";
import { addPhysics, initScene } from "./systems";

export const world = await Engine.createWorld()
  .addPlugin(demoPlugin)
  .addPlugin(physicsPlugin)
  .addPlugin(playerPlugin)
  .addPlugin(vrmPlugin)
  .addSystemsToSchedule(LatticeSchedules.Startup, initScene)
  .addSystems(addPhysics)
  .build();
