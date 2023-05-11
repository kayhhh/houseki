import {
  Engine,
  Geometry,
  IsNode,
  IsScene,
  Mesh,
  Parent,
  PerspectiveCamera,
  Position,
  Warehouse,
} from "@lattice-engine/core";
import { IsOrbitControls, orbitPlugin } from "@lattice-engine/orbit";
import { renderPlugin, RenderStore } from "@lattice-engine/render";
import { BoxGeometry, BufferAttribute } from "three";
import { Commands, CoreSchedule, Mut, MutDescriptor, Res } from "thyseus";
import { CommandsDescriptor, ResourceDescriptor } from "thyseus";

// Create canvas
const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.touchAction = "none";
document.body.appendChild(canvas);

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Create system to initialize the scene
function initScene(
  commands: Commands,
  warehouse: Res<Warehouse>,
  store: Res<Mut<RenderStore>>
) {
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

  const cameraPosition = new Position();
  cameraPosition.z = 5;

  const camera = commands
    .spawn()
    .add(cameraComponent)
    .add(cameraPosition)
    .addType(IsOrbitControls);

  store.activeCamera = camera.id;

  // Create a cube, using Three.js to generate the geometry
  const box = new BoxGeometry();

  const positionsAttribute = box.getAttribute("position") as BufferAttribute;
  const normalsAttribute = box.getAttribute("normal") as BufferAttribute;
  const indicesAttribute = box.index as BufferAttribute;

  const positions = positionsAttribute.array as Float32Array;
  const normals = normalsAttribute.array as Float32Array;
  const indices = indicesAttribute.array as Uint16Array;

  const geometry = new Geometry();
  geometry.positions.write(positions, warehouse);
  geometry.indices.write(indices, warehouse);
  geometry.normals.write(normals, warehouse);

  const parent = new Parent();
  parent.id = scene.id;

  commands.spawn().addType(IsNode).add(parent).addType(Mesh).add(geometry);
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

renderPlugin(builder);
orbitPlugin(builder);

const world = await builder.build();

// Create Engine
const engine = new Engine(world);

// Start the game loop
engine.start();
