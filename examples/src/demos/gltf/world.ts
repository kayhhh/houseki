import { Engine, LatticeSchedules } from "lattice-engine/core";
import { orbitPlugin } from "lattice-engine/orbit";
import { postprocessingPlugin } from "lattice-engine/postprocessing";
import { World } from "thyseus";

import { demoPlugin } from "../../utils/demoPlugin";
import { initScene, loadGltf } from "./systems";

export let world: World;

export async function createWorld() {
  world = await Engine.createWorld()
    .addPlugin(demoPlugin)
    .addPlugin(orbitPlugin)
    .addPlugin(postprocessingPlugin)
    .addSystemsToSchedule(LatticeSchedules.Startup, initScene)
    .addSystems(loadGltf)
    .build();
}
