import {
  Engine,
  IsNode,
  IsScene,
  Parent,
  PerspectiveCamera,
  Position,
} from "@lattice-engine/core";
import { gltfPlugin, GltfUri } from "@lattice-engine/gltf";
import { renderPlugin, RenderStore } from "@lattice-engine/render";
import { defineSystem } from "thyseus";

// Create canvas
const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Create system to initialize the scene
const createScene = defineSystem(
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

    // Add glTF model
    const gltf = new GltfUri();
    gltf.uri.write("/cube/Cube.gltf");

    const parent = new Parent();
    parent.id = scene.id;

    const position = new Position();
    position.x = 3;
    position.y = -2;
    position.z = -10;

    commands.spawn().addType(IsNode).add(parent).add(position).add(gltf);
  }
);

// Create world
const world = await Engine.createWorld()
  .addPlugin(renderPlugin)
  .addPlugin(gltfPlugin)
  .addStartupSystem(createScene)
  .build();

// Create Engine
const engine = new Engine(world);

// Start the game loop
engine.start();
