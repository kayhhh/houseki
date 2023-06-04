import { Asset, CoreStore, Warehouse } from "lattice-engine/core";
import { InputStruct } from "lattice-engine/input";
import {
  BoxCollider,
  CapsuleCollider,
  CharacterController,
  DynamicBody,
  KinematicBody,
  PhysicsConfig,
  Raycast,
  SphereCollider,
  StaticBody,
  TargetTransform,
  Velocity,
} from "lattice-engine/physics";
import {
  PlayerAvatar,
  PlayerBody,
  PlayerCamera,
  PlayerCameraMode,
  PlayerCameraView,
  TargetPosition,
  TargetRotation,
} from "lattice-engine/player";
import { WEBGL_CONSTANTS } from "lattice-engine/render";
import {
  GlobalTransform,
  Image,
  Material,
  Mesh,
  Parent,
  PerspectiveCamera,
  SceneStruct,
  Transform,
} from "lattice-engine/scene";
import { Text } from "lattice-engine/text";
import { Vrm } from "lattice-engine/vrm";
import { Commands, Mut, Res } from "thyseus";

import { createBoxGeometry } from "../../utils/createBoxGeometry";
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
  inputStruct: Res<Mut<InputStruct>>,
  physicsConfig: Res<Mut<PhysicsConfig>>
) {
  physicsConfig.debug = true;

  const scene = createScene(commands, coreStore, sceneStruct, 4096, 16);

  const devTexture = commands
    .spawn()
    .add(new Asset("/DevGrid.png"))
    .addType(Image);

  createBox([32, 1, 32], devTexture.id, commands, warehouse).add(
    new Parent(scene)
  );

  const stairs = commands
    .spawn()
    .add(new Parent(scene))
    .add(new Transform([-2, 0, -6]))
    .addType(GlobalTransform);

  createStairs(2, 0.125, 1, 10, commands, warehouse, devTexture.id)
    .add(new Parent(stairs))
    .add(new Transform([0, 0, 0]))
    .addType(GlobalTransform);

  createStairs(2, 0.125, 0.5, 20, commands, warehouse, devTexture.id)
    .add(new Parent(stairs))
    .add(new Transform([-3, 0, 0]))
    .addType(GlobalTransform);

  createStairs(2, 0.25, 0.5, 20, commands, warehouse, devTexture.id)
    .add(new Parent(stairs))
    .add(new Transform([-6, 0, 0]))
    .addType(GlobalTransform);

  const ramps = commands
    .spawn()
    .add(new Parent(scene))
    .add(new Transform([2, 0, -6]))
    .addType(GlobalTransform);

  createRamp(2, 10, 1, 15, commands, warehouse, devTexture.id)
    .add(new Parent(ramps))
    .add(new Transform([0, 0, 0]))
    .addType(GlobalTransform);

  createRamp(2, 10, 1, 30, commands, warehouse, devTexture.id)
    .add(new Parent(ramps))
    .add(new Transform([3, 0, 0]))
    .addType(GlobalTransform);

  createRamp(2, 10, 1, 45, commands, warehouse, devTexture.id)
    .add(new Parent(ramps))
    .add(new Transform([6, 0, 0]))
    .addType(GlobalTransform);

  createRamp(2, 10, 1, 60, commands, warehouse, devTexture.id)
    .add(new Parent(ramps))
    .add(new Transform([9, 0, 0]))
    .addType(GlobalTransform);

  // Create player body
  const spawn = [0, 4, 0] as const;
  const playerHeight = 1.6;
  const playerWidth = 0.4;

  const player = new PlayerBody();
  player.spawnPoint.fromArray(spawn);

  const body = commands
    .spawn()
    .add(new Parent(scene))
    .add(new Transform(spawn))
    .add(new TargetTransform(spawn))
    .addType(GlobalTransform)
    .addType(Velocity)
    .add(new CapsuleCollider(playerWidth, playerHeight - playerWidth * 2))
    .addType(KinematicBody)
    .addType(CharacterController)
    .add(player);

  // Create avatar
  const playerAvatar = new PlayerAvatar();
  playerAvatar.idleAnimation = "/animation/Idle.fbx";
  playerAvatar.jumpAnimation = "/animation/Falling.fbx";
  playerAvatar.leftWalkAnimation = "/animation/LeftWalk.fbx";
  playerAvatar.rightWalkAnimation = "/animation/RightWalk.fbx";
  playerAvatar.sprintAnimation = "/animation/Sprint.fbx";
  playerAvatar.walkAnimation = "/animation/Walk.fbx";

  commands
    .spawn()
    .add(new Transform([0, -playerHeight / 2, 0]))
    .addType(GlobalTransform)
    .add(new TargetRotation().set(0, 0, 0, 1))
    .add(new Parent(body))
    .add(new Vrm("/k-robot.vrm", true))
    .add(playerAvatar);

  // Create camera
  const camera = commands
    .spawn()
    .addType(Transform)
    .addType(GlobalTransform)
    .addType(TargetPosition)
    .add(new TargetRotation().set(0, 0, 0, 1))
    .add(new Parent(body))
    .addType(PerspectiveCamera)
    .add(new PlayerCamera(PlayerCameraMode.Both, PlayerCameraView.ThirdPerson))
    .addType(Raycast);

  sceneStruct.activeCamera = camera.id;
  inputStruct.enablePointerLock = true;

  // Create ball
  const ballRadius = 1;
  const ballGeometry = createSphereGeometry(warehouse, ballRadius);
  commands
    .spawn()
    .add(new Parent(scene))
    .add(new Transform([0, 3, 8]))
    .add(new TargetTransform([0, 3, 8]))
    .addType(GlobalTransform)
    .add(ballGeometry)
    .addType(Mesh)
    .add(new SphereCollider(ballRadius))
    .addType(DynamicBody);
}

function createRamp(
  rampWidth: number,
  rampHeight: number,
  rampDepth: number,
  rampAngle: number,
  commands: Commands,
  warehouse: Readonly<Warehouse>,
  textureId: bigint
) {
  const ramp = commands.spawn();

  // Angle -> quaternion
  const angle = (rampAngle * Math.PI) / 180;
  const x = Math.sin(angle / 2);
  const y = 0;
  const z = 0;
  const w = Math.cos(angle / 2);

  createBox(
    [rampWidth, rampDepth, rampHeight],
    textureId,
    commands,
    warehouse,
    new Transform([0, 0, 0], [x, y, z, w])
  ).add(new Parent(ramp));

  commands
    .spawn()
    .add(new Parent(ramp))
    .add(new Transform([0, 3, 0]))
    .addType(GlobalTransform)
    .add(new Text(`Angle: ${rampAngle}°`, undefined, 0.3));

  return ramp;
}

function createStairs(
  stairWidth: number,
  stepHeight: number,
  stepWidth: number,
  steps: number,
  commands: Commands,
  warehouse: Readonly<Warehouse>,
  textureId: bigint
) {
  const stairs = commands.spawn();

  for (let i = 0; i < steps; i++) {
    createBox(
      [stairWidth, stepHeight, stepWidth],
      textureId,
      commands,
      warehouse,
      new Transform([
        0,
        stepHeight * i + stepHeight / 2,
        -stepWidth * i + stepWidth / 2,
      ])
    ).add(new Parent(stairs));
  }

  commands
    .spawn()
    .add(new Parent(stairs))
    .add(new Transform([0, 3, 0]))
    .addType(GlobalTransform)
    .add(
      new Text(
        `Step height: ${stepHeight}m\nStep width: ${stepWidth}m`,
        undefined,
        0.3
      )
    );

  return stairs;
}

function createBox(
  size: [number, number, number],
  textureId: bigint,
  commands: Commands,
  warehouse: Readonly<Warehouse>,
  transform?: Transform
) {
  const material = new Material();
  material.roughness = 1;
  material.metalness = 0;
  material.baseColorTextureId = textureId;
  material.baseColorTextureInfo.wrapS = WEBGL_CONSTANTS.REPEAT;
  material.baseColorTextureInfo.wrapT = WEBGL_CONSTANTS.REPEAT;
  material.baseColorTextureInfo.minFilter =
    WEBGL_CONSTANTS.LINEAR_MIPMAP_LINEAR;
  material.baseColorTextureInfo.scale.set([size[0] / 2, size[2] / 2]);

  const materialEntity = commands.spawn().add(material);

  return commands
    .spawn()
    .add(transform ?? new Transform([0, -size[1] / 2, 0]))
    .addType(GlobalTransform)
    .add(new Mesh(materialEntity))
    .add(createBoxGeometry(warehouse, size))
    .add(new BoxCollider(size))
    .addType(StaticBody);
}
