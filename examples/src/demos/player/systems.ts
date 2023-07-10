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
  Transform,
} from "lattice-engine/scene";
import { Text } from "lattice-engine/text";
import { Commands, dropStruct, Mut, Res } from "thyseus";

import { createBox } from "../../utils/createBox";
import { createLights } from "../../utils/createLights";
import { createPlayer } from "../../utils/createPlayer";
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

  const { sceneId, rootId } = createScene(commands, coreStore, sceneStruct);
  createLights(commands, sceneId, 4096, 16);

  createPlayer([0, 4, 0], sceneId, commands, sceneStruct);

  createBox(commands, warehouse, {
    parentId: rootId,
    size: [32, 1, 32],
    translation: [0, -0.5, 0],
  });

  const parent = new Parent(rootId);
  const transform = new Transform();

  const stairsId = commands
    .spawn(true)
    .add(parent)
    .add(transform.set([-2, 0, -6]))
    .addType(GlobalTransform).id;

  createStairs(commands, warehouse, 2, 0.125, 1, 10, stairsId);
  createStairs(commands, warehouse, 2, 0.125, 0.5, 20, stairsId, [-3, 0, 0]);
  createStairs(commands, warehouse, 2, 0.25, 0.5, 20, stairsId, [-6, 0, 0]);

  const rampsId = commands
    .spawn(true)
    .add(parent)
    .add(transform.set([2, 0, -6]))
    .addType(GlobalTransform).id;

  createRamp(commands, warehouse, 2, 10, 1, 15, rampsId);
  createRamp(commands, warehouse, 2, 10, 1, 30, rampsId, [3, 0, 0]);
  createRamp(commands, warehouse, 2, 10, 1, 45, rampsId, [6, 0, 0]);
  createRamp(commands, warehouse, 2, 10, 1, 60, rampsId, [9, 0, 0]);

  const ballRadius = 1;
  const ballGeometry = createSphereGeometry(warehouse, ballRadius);
  const sphereCollider = new SphereCollider(ballRadius);
  const targetTransform = new TargetTransform();

  commands
    .spawn(true)
    .add(parent)
    .add(transform.set([0, 3, 8]))
    .add(targetTransform.set([0, 3, 8]))
    .addType(GlobalTransform)
    .add(ballGeometry)
    .addType(Mesh)
    .add(sphereCollider)
    .addType(DynamicBody);

  dropStruct(ballGeometry);
  dropStruct(sphereCollider);
  dropStruct(targetTransform);
  dropStruct(parent);
  dropStruct(transform);
}

function createStairs(
  commands: Commands,
  warehouse: Readonly<Warehouse>,
  stairWidth: number,
  stepHeight: number,
  stepWidth: number,
  steps: number,
  parentId: bigint,
  translation: [number, number, number] = [0, 0, 0]
) {
  const parent = new Parent(parentId);
  const transform = new Transform(translation);

  const stairId = commands
    .spawn(true)
    .add(parent)
    .add(transform)
    .addType(GlobalTransform).id;

  for (let i = 0; i < steps; i++) {
    createBox(commands, warehouse, {
      parentId: stairId,
      size: [stairWidth, stepHeight, stepWidth],
      translation: [0, stepHeight * i + stepHeight / 2, -stepWidth * i],
    });
  }

  const text = new Text();
  text.value = `Step height: ${stepHeight}m\nStep width: ${stepWidth}m`;
  text.fontSize = 0.3;

  commands
    .spawn(true)
    .add(parent.setId(stairId))
    .add(transform.set([0, 3, 0]))
    .addType(GlobalTransform)
    .add(text);

  dropStruct(text);
  dropStruct(parent);
  dropStruct(transform);

  return stairId;
}

function createRamp(
  commands: Commands,
  warehouse: Readonly<Warehouse>,
  rampWidth: number,
  rampHeight: number,
  rampDepth: number,
  rampAngle: number,
  parentId: bigint,
  translation: [number, number, number] = [0, 0, 0]
) {
  const parent = new Parent(parentId);
  const transform = new Transform(translation);

  const rampId = commands
    .spawn(true)
    .add(parent)
    .add(transform)
    .addType(GlobalTransform).id;

  // Angle -> quaternion
  const angle = (rampAngle * Math.PI) / 180;
  const x = Math.sin(angle / 2);
  const y = 0;
  const z = 0;
  const w = Math.cos(angle / 2);

  createBox(commands, warehouse, {
    parentId: rampId,
    rotation: [x, y, z, w],
    size: [rampWidth, rampDepth, rampHeight],
  });

  const text = new Text();
  text.value = `Angle: ${rampAngle}°`;
  text.fontSize = 0.3;

  commands
    .spawn(true)
    .add(parent.setId(rampId))
    .add(transform.set([0, 3, 0]))
    .addType(GlobalTransform)
    .add(text);

  dropStruct(text);
  dropStruct(parent);
  dropStruct(transform);
}
