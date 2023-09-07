import { Engine, ReddoSchedules } from "reddo/core";
import { physicsPlugin } from "reddo/physics";
import { playerPlugin } from "reddo/player";
import { portalPlugin } from "reddo/portal";
import { vrmPlugin } from "reddo/vrm";
import { World } from "thyseus";

import { demoPlugin } from "../../utils/demoPlugin";
import { initScene } from "./systems";

export let world: World;

export async function createWorld() {
  world = await Engine.createWorld()
    .addPlugin(demoPlugin)
    .addPlugin(physicsPlugin)
    .addPlugin(vrmPlugin)
    .addPlugin(playerPlugin)
    .addPlugin(portalPlugin)
    .addSystemsToSchedule(ReddoSchedules.Startup, initScene)
    .build();
}
