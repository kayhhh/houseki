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
  const cameraPosition = new Position(0, 0, 5);
  const camera = commands
    .spawn()
    .add(cameraComponent)
    .add(cameraPosition)
    .addType(IsOrbitControls);

  store.activeCamera = camera.id;

  // Create a cube
  const geometry = createBoxGeometry(warehouse);
  const parent = new Parent(scene);

  commands
    .spawn()
    // Add to scene
    .addType(IsNode)
    .add(parent)
    // Add mesh
    .addType(Mesh)
    .add(geometry);
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

const world = await builder.build();

// Create Engine
const engine = new Engine(world);

// Start the game loop
engine.start();
