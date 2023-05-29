import { CoreStore, Warehouse } from "lattice-engine/core";
import { InputStruct } from "lattice-engine/input";
import {
  CapsuleCollider,
  CharacterController,
  DynamicBody,
  KinematicBody,
  SphereCollider,
  Velocity,
} from "lattice-engine/physics";
import {
  PlayerAvatar,
  PlayerBody,
  PlayerCamera,
  PlayerCameraMode,
  PlayerCameraView,
} from "lattice-engine/player";
import {
  Mesh,
  Node,
  Parent,
  PerspectiveCamera,
  Position,
  Rotation,
  Scene,
  SceneStruct,
} from "lattice-engine/scene";
import { Vrm } from "lattice-engine/vrm";
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
  inputStruct: Res<Mut<InputStruct>>
) {
  // Set canvas
  const canvas = document.querySelector("canvas");
  if (!canvas) throw new Error("Canvas not found");
  coreStore.canvas = canvas;

  // Create scene
  const scene = commands.spawn().addType(Scene);
  sceneStruct.activeScene = scene.id;

  // Create room
  const room = createRoom([12, 4, 12], commands, warehouse);
  room.add(new Parent(scene));

  // Create player body
  const spawn = [0, 4, 0] as const;
  const playerHeight = 1.6;
  const playerWidth = 0.4;

  const player = new PlayerBody();
  player.spawnPoint.value = spawn;

  const body = commands
    .spawn()
    .addType(Node)
    .add(new Parent(scene))
    .add(new Position(...spawn))
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
    .add(new Position(0, -playerHeight / 2, 0))
    .addType(Rotation)
    .add(new Parent(body))
    .add(new Vrm("/k-robot.vrm", true))
    .add(playerAvatar);

  // Create camera
  const camera = commands
    .spawn()
    .addType(Node)
    .addType(Position)
    .addType(Rotation)
    .add(new Parent(body))
    .addType(PerspectiveCamera)
    .add(new PlayerCamera(PlayerCameraMode.Both, PlayerCameraView.ThirdPerson));

  sceneStruct.activeCamera = camera.id;
  inputStruct.enablePointerLock = true;

  // Create ball
  const ballRadius = 1;
  const ballGeometry = createSphereGeometry(warehouse, ballRadius);
  commands
    .spawn()
    .addType(Node)
    .add(new Parent(scene))
    .add(new Position(0, 3, -4))
    .add(ballGeometry)
    .addType(Mesh)
    .add(new SphereCollider(ballRadius))
    .addType(DynamicBody);
}
