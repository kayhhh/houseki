import { CoreStore, Warehouse } from "lattice-engine/core";
import {
  DynamicBody,
  PhysicsConfig,
  SphereCollider,
  TargetTransform,
} from "lattice-engine/physics";
import {
  GlobalTransform,
  Mesh,
  Parent,
  SceneStruct,
  StandardMaterial,
  Transform,
} from "lattice-engine/scene";
import { Commands, dropStruct, Mut, Res } from "thyseus";

import { createLights } from "../../utils/createLights";
import { createOrbitControls } from "../../utils/createOrbitControls";
import { createRoom } from "../../utils/createRoom";
import { createScene } from "../../utils/createScene";
import { createSphereGeometry } from "../../utils/geometry";

export function initScene(
  commands: Commands,
  warehouse: Res<Warehouse>,
  coreStore: Res<Mut<CoreStore>>,
  sceneStruct: Res<Mut<SceneStruct>>,
  physicsConfig: Res<Mut<PhysicsConfig>>,
) {
  physicsConfig.debug = true;

  createOrbitControls(commands, sceneStruct, [0, 5, 7]);
  const { rootId, sceneId } = createScene(commands, coreStore, sceneStruct);
  createLights(commands, sceneId);

  const parent = new Parent(rootId);

  const roomId = createRoom([8, 1, 8], commands, warehouse);
  commands.getById(roomId).add(parent);

  // Add dynamic balls
  const materialComponent = new StandardMaterial([1, 0.2, 0.5, 1], 0, 0);
  const materialId = commands.spawn(true).add(materialComponent).id;
  dropStruct(materialComponent);

  const transform = new Transform();
  const targetTransform = new TargetTransform();
  const mesh = new Mesh();
  mesh.materialId = materialId;
  const sphereCollider = new SphereCollider();

  function createBall(radius: number, translation: [number, number, number]) {
    const ballGeometry = createSphereGeometry(warehouse, radius);

    transform.translation.fromArray(translation);
    targetTransform.translation.fromArray(translation);
    sphereCollider.radius = radius;

    commands
      .spawn(true)
      .add(parent)
      .add(transform)
      .add(targetTransform)
      .addType(GlobalTransform)
      .add(mesh)
      .add(ballGeometry)
      .add(sphereCollider)
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

  dropStruct(transform);
  dropStruct(parent);
  dropStruct(mesh);
  dropStruct(targetTransform);
  dropStruct(sphereCollider);
}
