import { Engine, HousekiSchedules } from "houseki/core";
import { orbitPlugin } from "houseki/orbit";
import { postprocessingPlugin } from "houseki/postprocessing";
import { World } from "thyseus";

import { demoPlugin } from "../../utils/demoPlugin";
import { initScene, loadGltf } from "./systems";

export let world: World;

export async function createWorld() {
  world = await Engine.createWorld()
    .addPlugin(demoPlugin)
    .addPlugin(orbitPlugin)
    .addPlugin(postprocessingPlugin)
    .addSystemsToSchedule(HousekiSchedules.Startup, initScene)
    .addSystems(loadGltf)
    .build();
}
