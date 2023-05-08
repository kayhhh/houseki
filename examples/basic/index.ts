import {
  Engine,
  Geometry,
  IsNode,
  IsScene,
  Mesh,
  Parent,
  PerspectiveCamera,
  Position,
  warehouse,
} from "@lattice-engine/core";
import { renderPlugin, RenderStore } from "@lattice-engine/render";
import { BoxGeometry, BufferAttribute } from "three";
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

    // Create a cube, using Three.js to generate the geometry
    const box = new BoxGeometry();

    const positionsAttribute = box.getAttribute("position") as BufferAttribute;
    const normalsAttribute = box.getAttribute("normal") as BufferAttribute;
    const indicesAttribute = box.index as BufferAttribute;

    const positions = positionsAttribute.array as Float32Array;
    const normals = normalsAttribute.array as Float32Array;
    const indices = indicesAttribute.array as Uint16Array;

    const positionsId = warehouse.store(positions);
    const indicesId = warehouse.store(indices);
    const normalsId = warehouse.store(normals);

    const geometry = new Geometry();
    geometry.positions.id = positionsId;
    geometry.indices.id = indicesId;
    geometry.normals.id = normalsId;

    const parent = new Parent();
    parent.id = scene.id;

    const position = new Position();
    position.x = 3;
    position.y = -2;
    position.z = -10;

    commands
      .spawn()
      .addType(IsNode)
      .add(parent)
      .add(position)
      .addType(Mesh)
      .add(geometry);
  }
);

// Create world
const world = await Engine.createWorld()
  .addPlugin(renderPlugin)
  .addStartupSystem(createScene.beforeAll())
  .build();

// Create Engine
const engine = new Engine(world);

// Start the game loop
engine.start();
