import { Engine, LatticeSchedules } from "lattice-engine/core";
import { n8aoPlugin } from "lattice-engine/n8ao";
import { orbitPlugin } from "lattice-engine/orbit";
import { World } from "thyseus";

import { demoPlugin } from "../../utils/demoPlugin";
import { initScene, loadGltf } from "./systems";

export let world: World;

export async function createWorld() {
  world = await Engine.createWorld()
    .addPlugin(demoPlugin)
    .addPlugin(orbitPlugin)
    .addPlugin(n8aoPlugin)
    .addSystemsToSchedule(LatticeSchedules.Startup, initScene)
    .addSystems(loadGltf)
    .build();
}
