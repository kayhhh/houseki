import { Engine, HousekiSchedules } from "houseki/core";
import { orbitPlugin } from "houseki/orbit";
import { vrmPlugin } from "houseki/vrm";
import { World } from "thyseus";

import { demoPlugin } from "../../utils/demoPlugin";
import { initScene } from "./systems";

export let world: World;

export async function createWorld() {
  world = await Engine.createWorld()
    .addPlugin(demoPlugin)
    .addPlugin(orbitPlugin)
    .addPlugin(vrmPlugin)
    .addSystemsToSchedule(HousekiSchedules.Startup, initScene)
    .build();
}
