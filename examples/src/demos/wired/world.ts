import { Engine, LatticeSchedules } from "lattice-engine/core";
import { orbitPlugin } from "lattice-engine/orbit";
import { physicsPlugin } from "lattice-engine/physics";
import { playerPlugin } from "lattice-engine/player";
import { vrmPlugin } from "lattice-engine/vrm";
import { wiredPlugin } from "lattice-engine/wired";
import { World } from "thyseus";

import { demoPlugin } from "../../utils/demoPlugin";
import { initScene } from "./systems";

export let world: World;

export async function createWorld() {
  world = await Engine.createWorld()
    .addPlugin(demoPlugin)
    .addPlugin(physicsPlugin)
    .addPlugin(playerPlugin)
    .addPlugin(orbitPlugin)
    .addPlugin(vrmPlugin)
    .addPlugin(wiredPlugin)
    .addSystemsToSchedule(LatticeSchedules.Startup, initScene)
    .build();
}
