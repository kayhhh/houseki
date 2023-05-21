import { CoreStore, CoreStruct, Engine, Warehouse } from "@lattice-engine/core";
import { inputPlugin, InputStruct } from "@lattice-engine/input";
import { physicsPlugin } from "@lattice-engine/physics";
import { PlayerControls, playerPlugin } from "@lattice-engine/player";
import { renderPlugin } from "@lattice-engine/render";
import {
  Parent,
  PerspectiveCamera,
  Position,
  Rotation,
  Scene,
  scenePlugin,
} from "@lattice-engine/scene";
import { useEffect, useState } from "react";
import {
  Commands,
  CommandsDescriptor,
  CoreSchedule,
  Mut,
  MutDescriptor,
  Res,
  ResourceDescriptor,
} from "thyseus";

import Canvas from "../utils/Canvas";
import { createRoom } from "../utils/createRoom";

export default function Physics() {
  const [engine, setEngine] = useState<Engine>();

  // Create engine
  useEffect(() => {
    const builder = Engine.createWorld()
      .addPlugin(inputPlugin)
      .addPlugin(scenePlugin)
      .addPlugin(renderPlugin)
      .addPlugin(physicsPlugin)
      .addPlugin(playerPlugin)
      .addSystemsToSchedule(CoreSchedule.Startup, initScene);

    builder.build().then((world) => {
      const newEngine = new Engine(world);
      setEngine(newEngine);
    });
  }, []);

  // Run engine
  useEffect(() => {
    if (!engine) return;

    engine.start();

    return () => {
      engine.stop();
    };
  }, [engine]);

  return <Canvas />;
}

/**
 * System to initialize the scene.
 */
function initScene(
  commands: Commands,
  warehouse: Res<Warehouse>,
  coreStore: Res<Mut<CoreStore>>,
  coreStruct: Res<Mut<CoreStruct>>,
  inputStruct: Res<Mut<InputStruct>>
) {
  // Set canvas
  const canvas = document.querySelector("canvas");
  if (!canvas) throw new Error("Canvas not found");
  coreStore.canvas = canvas;

  // Create scene
  const scene = commands.spawn().addType(Scene);
  coreStruct.activeScene = scene.id;

  // Create room
  const room = createRoom([15, 2, 15], commands, warehouse);
  room.add(new Parent(scene));

  // Create camera and player
  const camera = commands
    .spawn()
    .add(new Position(0, 4, 0))
    .add(new Rotation())
    .addType(PerspectiveCamera)
    .addType(PlayerControls);
  coreStruct.activeCamera = camera.id;

  inputStruct.enablePointerLock = true;
}

initScene.parameters = [
  CommandsDescriptor(),
  ResourceDescriptor(Warehouse),
  ResourceDescriptor(MutDescriptor(CoreStore)),
  ResourceDescriptor(MutDescriptor(CoreStruct)),
  ResourceDescriptor(MutDescriptor(InputStruct)),
];
