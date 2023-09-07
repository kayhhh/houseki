import { Engine, ReddoSchedules } from "reddo/core";
import { orbitPlugin } from "reddo/orbit";
import { textPlugin } from "reddo/text";
import { World } from "thyseus";

import { demoPlugin } from "../../utils/demoPlugin";
import { initScene } from "./systems";

export let world: World;

export async function createWorld() {
  world = await Engine.createWorld()
    .addPlugin(demoPlugin)
    .addPlugin(orbitPlugin)
    .addPlugin(textPlugin)
    .addSystemsToSchedule(ReddoSchedules.Startup, initScene)
    .build();
}
