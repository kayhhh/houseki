import { Engine, LatticeSchedules } from "lattice-engine/core";
import { csmPlugin } from "lattice-engine/csm";
import { orbitPlugin } from "lattice-engine/orbit";
import { World } from "thyseus";

import { demoPlugin } from "../../utils/demoPlugin";
import { initScene } from "./systems";

export let world: World;

export async function createWorld() {
  world = await Engine.createWorld()
    .addPlugin(demoPlugin)
    .addPlugin(orbitPlugin)
    .addPlugin(csmPlugin)
    .addSystemsToSchedule(LatticeSchedules.Startup, initScene)
    .build();
}
