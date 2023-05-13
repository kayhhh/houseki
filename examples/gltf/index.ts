import {
  Engine,
  IsNode,
  IsScene,
  Parent,
  PerspectiveCamera,
  Position,
  Warehouse,
} from "@lattice-engine/core";
import { gltfPlugin, GltfUri } from "@lattice-engine/gltf";
import { IsOrbitControls, orbitPlugin } from "@lattice-engine/orbit";
import { renderPlugin, RenderStore } from "@lattice-engine/render";
import {
  Commands,
  CommandsDescriptor,
  CoreSchedule,
  Mut,
  MutDescriptor,
  Query,
  QueryDescriptor,
  Res,
  ResourceDescriptor,
} from "thyseus";

import { createCanvas } from "../utils/createCanvas";

const MODELS = {
  cube: "/Cube/Cube.gltf",
  damaged: "/DamagedHelmet/DamagedHelmet.glb",
  flight: "/FlightHelmet/FlightHelmet.gltf",
};

// Read model from url
const hash = window.location.hash.slice(1);
const defaultModel = MODELS[hash as keyof typeof MODELS] ?? MODELS.cube;

// Handle button input
class GltfStore {
  uri = defaultModel;
}

function buttonSystem(store: Res<Mut<GltfStore>>) {
  document.getElementById("btn-cube")?.addEventListener("click", () => {
    store.uri = "/Cube/Cube.gltf";
    window.location.hash = "";
  });

  document.getElementById("btn-flight")?.addEventListener("click", () => {
    store.uri = "/FlightHelmet/FlightHelmet.gltf";
    window.location.hash = "flight";
  });

  document.getElementById("btn-damaged")?.addEventListener("click", () => {
    store.uri = "/DamagedHelmet/DamagedHelmet.glb";
    window.location.hash = "damaged";
  });
}

buttonSystem.parameters = [ResourceDescriptor(MutDescriptor(GltfStore))];

// Load selected glTF model
function loadGltf(
  warehouse: Res<Warehouse>,
  store: Res<GltfStore>,
  entities: Query<GltfUri>
) {
  for (const gltf of entities) {
    // Ignore if already set
    if (gltf.uri.read(warehouse) === store.uri) continue;

    // Set new uri
    gltf.uri.write(store.uri, warehouse);
  }
}

loadGltf.parameters = [
  ResourceDescriptor(Warehouse),
  ResourceDescriptor(GltfStore),
  QueryDescriptor(GltfUri),
];

// Initialize the scene
function initScene(commands: Commands, store: Res<Mut<RenderStore>>) {
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

  // Add node to scene with glTF component
  const parent = new Parent(scene);

  commands
    .spawn()
    // Add to scene
    .addType(IsNode)
    .add(parent)
    // Add glTF
    .addType(GltfUri);
}

initScene.parameters = [
  CommandsDescriptor(),
  ResourceDescriptor(MutDescriptor(RenderStore)),
];

// Create world
const builder = Engine.createWorld()
  .addSystemsToSchedule(CoreSchedule.Startup, initScene, buttonSystem)
  .addSystems(loadGltf);

renderPlugin(builder);
gltfPlugin(builder);
orbitPlugin(builder);

const world = await builder.build();

// Create Engine
const engine = new Engine(world);

// Start the game loop
engine.start();
