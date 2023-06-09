import { Engine, LatticeSchedules } from "lattice-engine/core";
import { physicsPlugin } from "lattice-engine/physics";
import { playerPlugin } from "lattice-engine/player";
import { vrmPlugin } from "lattice-engine/vrm";
import { World } from "thyseus";

import { demoPlugin } from "../../utils/demoPlugin";
import { addPhysics, initScene } from "./systems";

export let world: World;

export async function createWorld() {
  world = await Engine.createWorld()
    .addPlugin(demoPlugin)
    .addPlugin(physicsPlugin)
    .addPlugin(playerPlugin)
    .addPlugin(vrmPlugin)
    .addSystemsToSchedule(LatticeSchedules.Startup, initScene)
    .addSystems(addPhysics)
    .build();
}
