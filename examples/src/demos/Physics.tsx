import { Engine, Warehouse } from "@lattice-engine/core";
import { OrbitControls, orbitPlugin } from "@lattice-engine/orbit";
import {
  BoxCollider,
  DynamicBody,
  StaticBody,
  physicsPlugin,
  SphereCollider,
} from "@lattice-engine/physics";
import { renderPlugin, RenderStore } from "@lattice-engine/render";
import {
  Material,
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
import { createSphereGeometry } from "../utils/createSphereGeometry";

export default function Physics() {
  const [engine, setEngine] = useState<Engine>();

  // Create engine
  useEffect(() => {
    const builder = Engine.createWorld()
      .addPlugin(scenePlugin)
      .addPlugin(renderPlugin)
      .addPlugin(orbitPlugin)
      .addPlugin(physicsPlugin)
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
  const scene = commands.spawn().addType(Scene);
  store.activeScene = scene.id;

  // Create camera
  const cameraPosition = new Position(0, 0, 8);
  const camera = commands
    .spawn()
    .add(cameraPosition)
    .addType(PerspectiveCamera)
    .addType(OrbitControls);
  store.activeCamera = camera.id;

  // Create ground
  const size = [10, 0.5, 10] as const;
  const collider = new BoxCollider(size);
  const geometry = createBoxGeometry(warehouse, size);
  const parent = new Parent(scene);
  const position = new Position(0, -2, 0);
  commands
    .spawn()
    .addType(Node)
    .add(parent)
    .add(position)
    .addType(Mesh)
    .add(geometry)
    .add(collider)
    .addType(StaticBody);

  // Add dynamic balls
  function createBall(radius: number, position: [number, number, number]) {
    const ballCollider = new SphereCollider(radius);
    const ballGeometry = createSphereGeometry(warehouse, radius);
    const ballMaterial = new Material([1, 0.2, 0.5, 1]);
    const ballParent = new Parent(scene);
    const ballPosition = new Position(...position);
    commands
      .spawn()
      .addType(Node)
      .add(ballParent)
      .add(ballPosition)
      .addType(Mesh)
      .add(ballGeometry)
      .add(ballMaterial)
      .add(ballCollider)
      .addType(DynamicBody);
  }

  const BALL_COUNT = 20;
  const BOUNDS = 4;

  for (let i = 0; i < BALL_COUNT; i++) {
    const radius = Math.random() * 0.4 + 0.2;

    const x = Math.random() * BOUNDS - BOUNDS / 2;
    const y = Math.random() * 10;
    const z = Math.random() * BOUNDS - BOUNDS / 2;

    createBall(radius, [x, y, z]);
  }
}

initScene.parameters = [
  CommandsDescriptor(),
  ResourceDescriptor(Warehouse),
  ResourceDescriptor(MutDescriptor(RenderStore)),
];
