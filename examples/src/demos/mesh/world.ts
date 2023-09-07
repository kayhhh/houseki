import { Engine, HousekiSchedules } from "houseki/core";
import { physicsPlugin } from "houseki/physics";
import { playerPlugin } from "houseki/player";
import { vrmPlugin } from "houseki/vrm";
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
    .addSystemsToSchedule(HousekiSchedules.Startup, initScene)
    .addSystems(addPhysics)
    .build();
}
