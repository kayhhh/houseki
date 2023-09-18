import { CoreStore, Warehouse } from "houseki/core";
import {
  DynamicBody,
  PhysicsConfig,
  PrevTargetTransform,
  SphereCollider,
  TargetTransform,
} from "houseki/physics";
import {
  GlobalTransform,
  Mesh,
  Parent,
  RenderView,
  StandardMaterial,
  Transform,
} from "houseki/scene";
import { Commands, Mut, Res } from "thyseus";

import { createLights } from "../../utils/createLights";
import { createOrbitControls } from "../../utils/createOrbitControls";
import { createRoom } from "../../utils/createRoom";
import { createScene } from "../../utils/createScene";
import { createSphereGeometry } from "../../utils/geometry";

export function initScene(
  warehouse: Res<Mut<Warehouse>>,
  commands: Commands,
  coreStore: Res<Mut<CoreStore>>,
  physicsConfig: Res<Mut<PhysicsConfig>>
) {
  physicsConfig.debug = true;

  const cameraId = createOrbitControls(commands, [0, 5, 7]);
  const { viewId, sceneId } = createScene(commands, coreStore);

  commands.getById(viewId).add(new RenderView(cameraId));

  createLights(commands, sceneId);
  const roomId = createRoom(warehouse, [8, 1, 8], commands);

  const parent = new Parent(sceneId);
  commands.getById(roomId).add(parent);

  // Add dynamic balls
  const materialComponent = new StandardMaterial([1, 0.2, 0.5, 1], 0, 0);
  const materialId = commands.spawn(true).add(materialComponent).id;

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
      .addType(PrevTargetTransform)
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
}
