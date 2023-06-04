import { CoreStore, Warehouse } from "lattice-engine/core";
import { OrbitControls } from "lattice-engine/orbit";
import {
  DynamicBody,
  PhysicsConfig,
  SphereCollider,
  TargetTransform,
} from "lattice-engine/physics";
import {
  GlobalTransform,
  Material,
  Mesh,
  Parent,
  PerspectiveCamera,
  SceneStruct,
  Transform,
} from "lattice-engine/scene";
import { Commands, Mut, Res } from "thyseus";

import { createRoom } from "../../utils/createRoom";
import { createScene } from "../../utils/createScene";
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

  const scene = createScene(commands, coreStore, sceneStruct);

  // Create camera
  const camera = commands
    .spawn()
    .add(new Transform([0, 6, 8]))
    .addType(GlobalTransform)
    .addType(PerspectiveCamera)
    .addType(OrbitControls);
  sceneStruct.activeCamera = camera.id;

  // Create room
  const room = createRoom([8, 1, 8], commands, warehouse);
  room.add(new Parent(scene));

  // Add dynamic balls
  const material = commands.spawn().add(new Material([1, 0.2, 0.5, 1], 0, 0));

  function createBall(radius: number, translation: [number, number, number]) {
    const ballGeometry = createSphereGeometry(warehouse, radius);
    commands
      .spawn()
      .add(new Parent(scene))
      .add(new Transform(translation))
      .addType(GlobalTransform)
      .add(new TargetTransform(translation))
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
