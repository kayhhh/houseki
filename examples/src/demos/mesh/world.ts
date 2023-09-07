import { Engine, ReddoSchedules } from "reddo/core";
import { physicsPlugin } from "reddo/physics";
import { playerPlugin } from "reddo/player";
import { vrmPlugin } from "reddo/vrm";
import { World } from "thyseus";

import { demoPlugin } from "../../utils/demoPlugin";
import { addPhysics, initScene } from "./systems";

export let world: World;

export async function createWorld() {
  world = await Engine.createWorld()
    .addPlugin(demoPlugin)
    .addPlugin(physicsPlugin)
    .addPlugin(playerPlugin)
    .addPlugin(vrmPlugin)
    .addSystemsToSchedule(ReddoSchedules.Startup, initScene)
    .addSystems(addPhysics)
    .build();
}
