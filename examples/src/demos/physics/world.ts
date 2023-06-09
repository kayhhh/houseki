import { Engine, LatticeSchedules } from "lattice-engine/core";
import { orbitPlugin } from "lattice-engine/orbit";
import { physicsPlugin } from "lattice-engine/physics";
import { World } from "thyseus";

import { demoPlugin } from "../../utils/demoPlugin";
import { initScene } from "./systems";

export let world: World;

export async function createWorld() {
  world = await Engine.createWorld()
    .addPlugin(demoPlugin)
    .addPlugin(orbitPlugin)
    .addPlugin(physicsPlugin)
    .addSystemsToSchedule(LatticeSchedules.Startup, initScene)
    .build();
}
