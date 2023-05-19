import { Engine, Warehouse } from "@lattice-engine/core";
import { IsOrbitControls, orbitPlugin } from "@lattice-engine/orbit";
import {
  BoxCollider,
  IsDynamicBody,
  IsStaticBody,
  physicsPlugin,
  SphereCollider,
} from "@lattice-engine/physics";
import { renderPlugin, RenderStore } from "@lattice-engine/render";
import {
  IsNode,
  IsScene,
  Material,
  Mesh,
  Parent,
  PerspectiveCamera,
  Position,
  scenePlugin,
} from "@lattice-engine/scene";
import {
  Commands,
  CommandsDescriptor,
  CoreSchedule,
  Mut,
  MutDescriptor,
  Res,
  ResourceDescriptor,
} from "thyseus";

import { createBoxGeometry } from "../utils/createBoxGeometry";
import { createCanvas } from "../utils/createCanvas";
import { createSphereGeometry } from "../utils/createSphereGeometry";

// Create system to initialize the scene
function initScene(
  commands: Commands,
  warehouse: Res<Warehouse>,
  store: Res<Mut<RenderStore>>
) {
  // Set canvas
  const canvas = createCanvas();
  store.setCanvas(canvas);

  // Create scene
  const scene = commands.spawn().addType(IsScene);
  store.activeScene = scene.id;

  // Create camera
  const cameraComponent = new PerspectiveCamera();
  const cameraPosition = new Position(0, 0, 8);
  const camera = commands
    .spawn()
    .add(cameraComponent)
    .add(cameraPosition)
    .addType(IsOrbitControls);

  store.activeCamera = camera.id;

  // Create ground
  const size = [10, 0.5, 10] as const;
  const collider = new BoxCollider(size);
  const geometry = createBoxGeometry(warehouse, size);
  const parent = new Parent(scene);
  const position = new Position(0, -2, 0);

  commands
    .spawn()
    // Add to scene
    .addType(IsNode)
    .add(parent)
    .add(position)
    // Add mesh
    .addType(Mesh)
    .add(geometry)
    // Add physics collider
    .add(collider)
    .addType(IsStaticBody);

  // Add dynamic balls
  function createBall(radius: number, position: [number, number, number]) {
    const ballCollider = new SphereCollider(radius);
    const ballGeometry = createSphereGeometry(warehouse, radius);
    const ballMaterial = new Material([1, 0.2, 0.5, 1]);
    const ballParent = new Parent(scene);
    const ballPosition = new Position(...position);

    commands
      .spawn()
      // Add to scene
      .addType(IsNode)
      .add(ballParent)
      .add(ballPosition)
      // Add mesh
      .addType(Mesh)
      .add(ballGeometry)
      .add(ballMaterial)
      // Add physics collider
      .add(ballCollider)
      .addType(IsDynamicBody);
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

// Create world
const builder = Engine.createWorld().addSystemsToSchedule(
  CoreSchedule.Startup,
  initScene
);

scenePlugin(builder);
renderPlugin(builder);
orbitPlugin(builder);
physicsPlugin(builder);

const world = await builder.build();

// Create Engine
const engine = new Engine(world);

// Start the game loop
engine.start();
