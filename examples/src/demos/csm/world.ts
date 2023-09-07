import { Engine, ReddoSchedules } from "reddo/core";
import { csmPlugin } from "reddo/csm";
import { orbitPlugin } from "reddo/orbit";
import { World } from "thyseus";

import { demoPlugin } from "../../utils/demoPlugin";
import { initScene } from "./systems";

export let world: World;

export async function createWorld() {
  world = await Engine.createWorld()
    .addPlugin(demoPlugin)
    .addPlugin(orbitPlugin)
    .addPlugin(csmPlugin)
    .addSystemsToSchedule(ReddoSchedules.Startup, initScene)
    .build();
}
