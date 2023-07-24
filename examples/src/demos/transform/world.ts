import { Engine, LatticeSchedules } from "lattice-engine/core";
import { orbitPlugin } from "lattice-engine/orbit";
import { physicsPlugin } from "lattice-engine/physics";
import { postprocessingPlugin } from "lattice-engine/postprocessing";
import { getTransformPlugin } from "lattice-engine/transform";
import { World } from "thyseus";

import { demoPlugin } from "../../utils/demoPlugin";
import { initScene, setTransformMode } from "./systems";

export let world: World;

export async function createWorld() {
  world = await Engine.createWorld()
    .addPlugin(demoPlugin)
    .addPlugin(physicsPlugin)
    .addPlugin(orbitPlugin)
    .addPlugin(postprocessingPlugin)
    .addPlugin(getTransformPlugin({ orbitControls: true, physics: true }))
    .addSystemsToSchedule(LatticeSchedules.Startup, initScene)
    .addSystems(setTransformMode)
    .build();
}
