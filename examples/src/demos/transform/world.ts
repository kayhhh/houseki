import { Engine, HousekiSchedules } from "houseki/core";
import { orbitPlugin } from "houseki/orbit";
import { physicsPlugin } from "houseki/physics";
import { postprocessingPlugin } from "houseki/postprocessing";
import { getTransformPlugin } from "houseki/transform";
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
    .addPlugin(getTransformPlugin({ orbitControls: true }))
    .addSystemsToSchedule(HousekiSchedules.Startup, initScene)
    .addSystems(setTransformMode)
    .build();
}
