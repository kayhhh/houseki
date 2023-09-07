import { Engine, HousekiSchedules } from "houseki/core";
import { orbitPlugin } from "houseki/orbit";
import { World } from "thyseus";

import { demoPlugin } from "../../utils/demoPlugin";
import { initScene } from "./systems";

export let world: World;

export async function createWorld() {
  world = await Engine.createWorld()
    .addPlugin(demoPlugin)
    .addPlugin(orbitPlugin)
    .addSystemsToSchedule(HousekiSchedules.Startup, initScene)
    .build();
}
