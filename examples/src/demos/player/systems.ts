import { CoreStore, Warehouse } from "houseki/core";
import {
  DynamicBody,
  PhysicsConfig,
  SphereCollider,
  TargetTransform,
} from "houseki/physics";
import {
  GlobalTransform,
  Mesh,
  Parent,
  SceneStruct,
  Transform,
} from "houseki/scene";
import { Text } from "houseki/text";
import { Commands, Mut, Res } from "thyseus";

import { createBox } from "../../utils/createBox";
import { createLights } from "../../utils/createLights";
import { createPlayer } from "../../utils/createPlayer";
import { createScene } from "../../utils/createScene";
import { createSphereGeometry } from "../../utils/geometry";

export function initScene(
  warehouse: Res<Mut<Warehouse>>,
  commands: Commands,
  coreStore: Res<Mut<CoreStore>>,
  sceneStruct: Res<Mut<SceneStruct>>,
  physicsConfig: Res<Mut<PhysicsConfig>>
) {
  physicsConfig.debug = true;

  const { sceneId, rootId } = createScene(commands, coreStore, sceneStruct);
  createLights(commands, sceneId, 4096, 16);

  createPlayer([0, 4, 0], sceneId, commands, sceneStruct);

  createBox(warehouse, commands, {
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

  createStairs(warehouse, commands, 2, 0.125, 1, 10, stairsId);
  createStairs(warehouse, commands, 2, 0.125, 0.5, 20, stairsId, [-3, 0, 0]);
  createStairs(warehouse, commands, 2, 0.25, 0.5, 20, stairsId, [-6, 0, 0]);

  const rampsId = commands
    .spawn(true)
    .add(parent)
    .add(transform.set([2, 0, -6]))
    .addType(GlobalTransform).id;

  createRamp(warehouse, commands, 2, 10, 1, 15, rampsId);
  createRamp(warehouse, commands, 2, 10, 1, 30, rampsId, [3, 0, 0]);
  createRamp(warehouse, commands, 2, 10, 1, 45, rampsId, [6, 0, 0]);
  createRamp(warehouse, commands, 2, 10, 1, 60, rampsId, [9, 0, 0]);

  const ballRadius = 1;

  commands
    .spawn(true)
    .add(parent)
    .add(transform.set([0, 3, 8]))
    .add(new TargetTransform().set([0, 3, 8]))
    .addType(GlobalTransform)
    .add(createSphereGeometry(warehouse, ballRadius))
    .addType(Mesh)
    .add(new SphereCollider(ballRadius))
    .addType(DynamicBody);
}

function createStairs(
  warehouse: Warehouse,
  commands: Commands,
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
    createBox(warehouse, commands, {
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

  return stairId;
}

function createRamp(
  warehouse: Warehouse,
  commands: Commands,
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

  createBox(warehouse, commands, {
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
}
