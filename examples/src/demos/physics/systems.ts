import { CoreStore, Warehouse } from "lattice-engine/core";
import { OrbitControls } from "lattice-engine/orbit";
import {
  DynamicBody,
  PhysicsConfig,
  SphereCollider,
} from "lattice-engine/physics";
import {
  Material,
  Mesh,
  Node,
  Parent,
  PerspectiveCamera,
  Position,
  Scene,
  SceneStruct,
} from "lattice-engine/scene";
import { Commands, Mut, Res } from "thyseus";

import { createRoom } from "../../utils/createRoom";
import { createSphereGeometry } from "../../utils/createSphereGeometry";

/**
 * System to initialize the scene.
 */
export function initScene(
  commands: Commands,
  warehouse: Res<Warehouse>,
  coreStore: Res<Mut<CoreStore>>,
  sceneStruct: Res<Mut<SceneStruct>>,
  physicsConfig: Res<Mut<PhysicsConfig>>
) {
  physicsConfig.debug = true;

  // Set canvas
  const canvas = document.querySelector("canvas");
  if (!canvas) throw new Error("Canvas not found");
  coreStore.canvas = canvas;

  // Create scene
  const scene = commands.spawn().addType(Scene);
  sceneStruct.activeScene = scene.id;

  // Create camera
  const camera = commands
    .spawn()
    .add(new Position(0, 6, 8))
    .addType(PerspectiveCamera)
    .addType(OrbitControls);
  sceneStruct.activeCamera = camera.id;

  // Create room
  const room = createRoom([8, 1, 8], commands, warehouse);
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
  const BOUNDS = 3;

  for (let i = 0; i < BALL_COUNT; i++) {
    const radius = Math.random() * 0.2 + 0.1;

    const x = Math.random() * BOUNDS - BOUNDS / 2;
    const y = Math.random() * 20 + 4;
    const z = Math.random() * BOUNDS - BOUNDS / 2;

    createBall(radius, [x, y, z]);
  }
}
