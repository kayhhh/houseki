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
import { Commands, dropStruct, Mut, Res } from "thyseus";

import { createRoom } from "../../utils/createRoom";
import { createScene } from "../../utils/createScene";
import { createSphereGeometry } from "../../utils/geometry";

export function initScene(
  commands: Commands,
  warehouse: Res<Warehouse>,
  coreStore: Res<Mut<CoreStore>>,
  sceneStruct: Res<Mut<SceneStruct>>,
  physicsConfig: Res<Mut<PhysicsConfig>>
) {
  physicsConfig.debug = true;

  const { root } = createScene(commands, coreStore, sceneStruct);

  const transform = new Transform([0, 6, 8]);

  const camera = commands
    .spawn()
    .add(transform)
    .addType(GlobalTransform)
    .addType(PerspectiveCamera)
    .addType(OrbitControls);

  sceneStruct.activeCamera = camera.id;

  const parent = new Parent(root);

  createRoom([8, 1, 8], commands, warehouse).add(parent);

  // Add dynamic balls
  const materialComponent = new Material([1, 0.2, 0.5, 1], 0, 0);
  const material = commands.spawn().add(materialComponent);
  dropStruct(materialComponent);

  const targetTransform = new TargetTransform();
  const mesh = new Mesh(material);
  const sphereCollider = new SphereCollider();

  function createBall(radius: number, translation: [number, number, number]) {
    const ballGeometry = createSphereGeometry(warehouse, radius);

    transform.translation.fromArray(translation);
    targetTransform.translation.fromArray(translation);
    sphereCollider.radius = radius;

    commands
      .spawn()
      .add(parent)
      .add(transform)
      .add(targetTransform)
      .addType(GlobalTransform)
      .add(mesh)
      .add(ballGeometry)
      .add(sphereCollider)
      .addType(DynamicBody);
  }

  const BALL_COUNT = 20;
  const BOUNDS = 3;

  for (let i = 0; i < BALL_COUNT; i++) {
    const radius = Math.random() * 0.2 + 0.1;

    const x = Math.random() * BOUNDS - BOUNDS / 2;
    const y = Math.random() * 20 + 4;
    const z = Math.random() * BOUNDS - BOUNDS / 2;

    createBall(radius, [x, y, z]);
  }

  dropStruct(transform);
  dropStruct(parent);
  dropStruct(mesh);
  dropStruct(targetTransform);
  dropStruct(sphereCollider);
}
