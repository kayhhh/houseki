import { Engine, ReddoSchedules } from "reddo/core";
import { orbitPlugin } from "reddo/orbit";
import { physicsPlugin } from "reddo/physics";
import { postprocessingPlugin } from "reddo/postprocessing";
import { getTransformPlugin } from "reddo/transform";
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
    .addSystemsToSchedule(ReddoSchedules.Startup, initScene)
    .addSystems(setTransformMode)
    .build();
}
