import { Engine, Warehouse } from "@lattice-engine/core";
import { IsOrbitControls, orbitPlugin } from "@lattice-engine/orbit";
import { renderPlugin, RenderStore } from "@lattice-engine/render";
import {
  IsNode,
  IsScene,
  Mesh,
  Parent,
  PerspectiveCamera,
  Position,
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
  store: Res<Mut<RenderStore>>
) {
  // Set canvas
  const canvas = document.querySelector("canvas");
  if (!canvas) throw new Error("Canvas not found");
  store.setCanvas(canvas);

  // Create scene
  const scene = commands.spawn().addType(IsScene);
  store.activeScene = scene.id;

  // Create camera
  const cameraComponent = new PerspectiveCamera();
  const cameraPosition = new Position(0, 0, 5);
  const camera = commands
    .spawn()
    .add(cameraComponent)
    .add(cameraPosition)
    .addType(IsOrbitControls);
  store.activeCamera = camera.id;

  // Create cube
  const geometry = createBoxGeometry(warehouse);
  const parent = new Parent(scene);
  commands.spawn().addType(IsNode).add(parent).addType(Mesh).add(geometry);
}

initScene.parameters = [
  CommandsDescriptor(),
  ResourceDescriptor(Warehouse),
  ResourceDescriptor(MutDescriptor(RenderStore)),
];
