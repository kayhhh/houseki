import { Engine, ReddoSchedules } from "reddo/core";
import { orbitPlugin } from "reddo/orbit";
import { postprocessingPlugin } from "reddo/postprocessing";
import { World } from "thyseus";

import { demoPlugin } from "../../utils/demoPlugin";
import { initScene, loadGltf } from "./systems";

export let world: World;

export async function createWorld() {
  world = await Engine.createWorld()
    .addPlugin(demoPlugin)
    .addPlugin(orbitPlugin)
    .addPlugin(postprocessingPlugin)
    .addSystemsToSchedule(ReddoSchedules.Startup, initScene)
    .addSystems(loadGltf)
    .build();
}
