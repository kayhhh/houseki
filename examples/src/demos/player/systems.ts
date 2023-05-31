import { CoreStore, Warehouse } from "lattice-engine/core";
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
  Material,
  Mesh,
  Node,
  Parent,
  PerspectiveCamera,
  Position,
  Rotation,
  Scene,
  SceneStruct,
  Texture,
} from "lattice-engine/scene";
import { Vrm } from "lattice-engine/vrm";
import { Commands, Mut, Res } from "thyseus";

import { createBoxGeometry } from "../../utils/createBoxGeometry";
import { createSphereGeometry } from "../../utils/createSphereGeometry";

const devTextureFetch = await fetch("/DevGrid.png");
const devTextureArray = new Uint8Array(await devTextureFetch.arrayBuffer());

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

  // Set canvas
  const canvas = document.querySelector("canvas");
  if (!canvas) throw new Error("Canvas not found");
  coreStore.canvas = canvas;

  // Create scene
  const scene = commands.spawn().addType(Scene);
  sceneStruct.activeScene = scene.id;

  const groundSize = [16, 1, 16] as const;

  const devTexture = new Texture();
  devTexture.image.write(devTextureArray, warehouse);
  const devTextureEntity = commands.spawn().add(devTexture);

  const material = new Material();
  material.roughness = 1;
  material.metalness = 0;
  material.baseColorTextureId = devTextureEntity.id;
  material.baseColorTextureInfo.wrapS = WEBGL_CONSTANTS.REPEAT;
  material.baseColorTextureInfo.wrapT = WEBGL_CONSTANTS.REPEAT;
  material.baseColorTextureInfo.minFilter =
    WEBGL_CONSTANTS.LINEAR_MIPMAP_LINEAR;
  material.baseColorTextureInfo.scale.set([
    groundSize[0] / 2,
    groundSize[2] / 2,
  ]);
  const materialEntity = commands.spawn().add(material);

  const geometry = createBoxGeometry(warehouse, groundSize);
  commands
    .spawn()
    .addType(Node)
    .add(new Parent(scene))
    .add(new Position().set(0, -groundSize[1] / 2, 0))
    .add(new Mesh(materialEntity))
    .add(geometry)
    .add(new BoxCollider(groundSize))
    .addType(StaticBody);

  const boxSize = [2, 2, 2] as const;
  const geometry2 = createBoxGeometry(warehouse, boxSize);
  commands
    .spawn()
    .addType(Node)
    .add(new Parent(scene))
    .add(new Position().set(6, boxSize[1] / 2, 0))
    .add(new Mesh(materialEntity))
    .add(geometry2)
    .add(new BoxCollider(boxSize))
    .addType(StaticBody);

  // Create player body
  const spawn = [0, 4, 0] as const;
  const playerHeight = 1.6;
  const playerWidth = 0.4;

  const player = new PlayerBody();
  player.spawnPoint.fromArray(spawn);

  const body = commands
    .spawn()
    .addType(Node)
    .add(new Parent(scene))
    .add(new Position().fromArray(spawn))
    .addType(Rotation)
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
    .addType(Node)
    .add(new Position().set(0, -playerHeight / 2, 0))
    .addType(Rotation)
    .add(new TargetRotation().set(0, 0, 0, 1))
    .add(new Parent(body))
    .add(new Vrm("/k-robot.vrm", true))
    .add(playerAvatar);

  // Create camera
  const camera = commands
    .spawn()
    .addType(Node)
    .addType(Position)
    .addType(Rotation)
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
    .addType(Node)
    .add(new Parent(scene))
    .add(new Position().set(0, 3, -4))
    .add(ballGeometry)
    .addType(Mesh)
    .add(new SphereCollider(ballRadius))
    .addType(DynamicBody);
}
