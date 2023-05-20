import { CoreStore, Engine, Warehouse } from "@lattice-engine/core";
import { inputPlugin } from "@lattice-engine/input";
import { OrbitControls, orbitPlugin } from "@lattice-engine/orbit";
import { renderPlugin } from "@lattice-engine/render";
import {
  Mesh,
  Node,
  Parent,
  PerspectiveCamera,
  Position,
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
import { createBoxGeometry } from "../utils/createBoxGeometry";

export default function Basic() {
  const [engine, setEngine] = useState<Engine>();

  // Create engine
  useEffect(() => {
    const builder = Engine.createWorld()
      .addPlugin(inputPlugin)
      .addPlugin(scenePlugin)
      .addPlugin(renderPlugin)
      .addPlugin(orbitPlugin)
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
  store: Res<Mut<CoreStore>>
) {
  // Set canvas
  const canvas = document.querySelector("canvas");
  if (!canvas) throw new Error("Canvas not found");
  store.canvas = canvas;

  // Create scene
  const scene = commands.spawn().addType(Scene);
  store.activeScene = scene.id;

  // Create camera
  const camera = commands
    .spawn()
    .add(new Position(0, 0, 5))
    .addType(PerspectiveCamera)
    .addType(OrbitControls);
  store.activeCamera = camera.id;

  // Create cube
  const geometry = createBoxGeometry(warehouse);
  commands
    .spawn()
    .addType(Node)
    .add(new Parent(scene))
    .addType(Mesh)
    .add(geometry);
}

initScene.parameters = [
  CommandsDescriptor(),
  ResourceDescriptor(Warehouse),
  ResourceDescriptor(MutDescriptor(CoreStore)),
];
