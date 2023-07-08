import { Engine, LatticeSchedules } from "lattice-engine/core";
import { orbitPlugin } from "lattice-engine/orbit";
import { postprocessingPlugin } from "lattice-engine/postprocessing";
import { transformPlugin } from "lattice-engine/transform";
import { World } from "thyseus";

import { demoPlugin } from "../../utils/demoPlugin";
import { initScene, setTransformMode } from "./systems";

export let world: World;

export async function createWorld() {
  world = await Engine.createWorld()
    .addPlugin(demoPlugin)
    .addPlugin(orbitPlugin)
    .addPlugin(transformPlugin)
    .addPlugin(postprocessingPlugin)
    .addSystemsToSchedule(LatticeSchedules.Startup, initScene)
    .addSystems(setTransformMode)
    .build();
}
