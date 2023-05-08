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
import { renderPlugin, RenderStore } from "@lattice-engine/render";
import { defineSystem } from "thyseus";

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

const buttonSystem = defineSystem(
  ({ Res, Mut }) => [Res(Mut(GltfStore))],
  (store) => {
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
);

// Load selected glTF model
const loadGltf = defineSystem(
  ({ Res, Query }) => [Res(Warehouse), Res(GltfStore), Query(GltfUri)],
  (warehouse, store, entities) => {
    for (const gltf of entities) {
      // Ignore if already set
      if (gltf.uri.read(warehouse) === store.uri) continue;

      // Set new uri
      gltf.uri.write(store.uri, warehouse);
    }
  }
);

// Create canvas
const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Initialize the scene
const initScene = defineSystem(
  ({ Res, Mut, Commands }) => [Res(Mut(RenderStore)), Commands()],
  (store, commands) => {
    // Set canvas
    store.setCanvas(canvas);

    // Create scene
    const scene = commands.spawn().addType(IsScene);
    store.activeScene = scene.id;

    // Create camera
    const cameraComponent = new PerspectiveCamera();
    cameraComponent.fov = 75;
    cameraComponent.near = 0.1;
    cameraComponent.far = 1000;

    const camera = commands.spawn().add(cameraComponent);
    store.activeCamera = camera.id;

    // Add node with glTF component
    const parent = new Parent();
    parent.id = scene.id;

    const position = new Position();
    position.y = -2;
    position.z = -5;

    const gltf = commands
      .spawn()
      .addType(IsNode)
      .add(parent)
      .add(position)
      .addType(GltfUri);
  }
);

// Create world
const world = await Engine.createWorld()
  .addPlugin(renderPlugin)
  .addPlugin(gltfPlugin)
  .addStartupSystem(initScene)
  .addStartupSystem(buttonSystem)
  .addSystem(loadGltf)
  .build();

// Create Engine
const engine = new Engine(world);

// Start the game loop
engine.start();
