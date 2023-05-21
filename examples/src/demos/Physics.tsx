import { CoreStore, CoreStruct, Engine, Warehouse } from "@lattice-engine/core";
import { inputPlugin } from "@lattice-engine/input";
import { OrbitControls, orbitPlugin } from "@lattice-engine/orbit";
import {
  DynamicBody,
  physicsPlugin,
  SphereCollider,
} from "@lattice-engine/physics";
import { renderPlugin } from "@lattice-engine/render";
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
import { Commands, CoreSchedule, Mut, Res } from "thyseus";

import Canvas from "../utils/Canvas";
import { createRoom } from "../utils/createRoom";
import { createSphereGeometry } from "../utils/createSphereGeometry";

export default function Physics() {
  const [engine, setEngine] = useState<Engine>();

  // Create engine
  useEffect(() => {
    const builder = Engine.createWorld()
      .addPlugin(inputPlugin)
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
  coreStore: Res<Mut<CoreStore>>,
  coreStruct: Res<Mut<CoreStruct>>
) {
  // Set canvas
  const canvas = document.querySelector("canvas");
  if (!canvas) throw new Error("Canvas not found");
  coreStore.canvas = canvas;

  // Create scene
  const scene = commands.spawn().addType(Scene);
  coreStruct.activeScene = scene.id;

  // Create camera
  const camera = commands
    .spawn()
    .add(new Position(0, 6, 10))
    .addType(PerspectiveCamera)
    .addType(OrbitControls);
  coreStruct.activeCamera = camera.id;

  // Create room
  const room = createRoom([15, 2, 15], commands, warehouse);
  room.add(new Parent(scene));

  // Add dynamic balls
  const material = commands.spawn().add(new Material([1, 0.2, 0.5, 1]));

  function createBall(radius: number, position: [number, number, number]) {
    const ballGeometry = createSphereGeometry(warehouse, radius);
    commands
      .spawn()
      .addType(Node)
      .add(new Parent(scene))
      .add(new Position(...position))
      .add(new Mesh(material))
      .add(ballGeometry)
      .add(new SphereCollider(radius))
      .addType(DynamicBody);
  }

  const BALL_COUNT = 50;
  const BOUNDS = 5;

  for (let i = 0; i < BALL_COUNT; i++) {
    const radius = Math.random() * 0.4 + 0.2;

    const x = Math.random() * BOUNDS - BOUNDS / 2;
    const y = Math.random() * 20 + 4;
    const z = Math.random() * BOUNDS - BOUNDS / 2;

    createBall(radius, [x, y, z]);
  }
}
