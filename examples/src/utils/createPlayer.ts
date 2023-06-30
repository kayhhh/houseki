import { InputStruct } from "lattice-engine/input";
import {
  CapsuleCollider,
  CharacterController,
  KinematicBody,
  Raycast,
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
import {
  GlobalTransform,
  Parent,
  PerspectiveCamera,
  SceneStruct,
  Transform,
} from "lattice-engine/scene";
import { Vrm } from "lattice-engine/vrm";
import { Commands, dropStruct } from "thyseus";

const PLAYER_HEIGHT = 1.6;
const PLAYER_WIDTH = 0.4;

export function createPlayer(
  spawn: [number, number, number],
  rootId: bigint,
  commands: Commands,
  sceneStruct: SceneStruct,
  inputStruct: InputStruct
) {
  const parent = new Parent();
  const transform = new Transform();

  const player = new PlayerBody();
  player.spawnPoint.fromArray(spawn);

  const targetTransform = new TargetTransform();
  const capsuleCollider = new CapsuleCollider(
    PLAYER_WIDTH,
    PLAYER_HEIGHT - PLAYER_WIDTH * 2
  );

  const bodyId = commands
    .spawn()
    .add(parent.setId(rootId))
    .add(transform.set(spawn))
    .add(targetTransform.set(spawn))
    .addType(GlobalTransform)
    .addType(Velocity)
    .add(capsuleCollider)
    .addType(KinematicBody)
    .addType(CharacterController)
    .add(player).id;

  dropStruct(player);
  dropStruct(targetTransform);
  dropStruct(capsuleCollider);

  const playerAvatar = new PlayerAvatar();
  playerAvatar.idleAnimation = "/animation/Idle.fbx";
  playerAvatar.jumpAnimation = "/animation/Falling.fbx";
  playerAvatar.leftWalkAnimation = "/animation/LeftWalk.fbx";
  playerAvatar.rightWalkAnimation = "/animation/RightWalk.fbx";
  playerAvatar.sprintAnimation = "/animation/Sprint.fbx";
  playerAvatar.walkAnimation = "/animation/Walk.fbx";

  const targetRotation = new TargetRotation();
  const vrm = new Vrm("/k-robot.vrm", true);

  commands
    .spawn()
    .add(transform.set([0, -PLAYER_HEIGHT / 2, 0]))
    .addType(GlobalTransform)
    .add(targetRotation.set(0, 0, 0, 1))
    .add(parent.setId(bodyId))
    .add(vrm)
    .add(playerAvatar);

  dropStruct(playerAvatar);
  dropStruct(vrm);

  const playerCamera = new PlayerCamera(
    PlayerCameraMode.Both,
    PlayerCameraView.ThirdPerson
  );

  const cameraId = commands
    .spawn()
    .addType(Transform)
    .addType(GlobalTransform)
    .addType(TargetPosition)
    .add(targetRotation.set(0, 0, 0, 1))
    .add(parent.setId(bodyId))
    .addType(PerspectiveCamera)
    .add(playerCamera)
    .addType(Raycast).id;

  dropStruct(parent);
  dropStruct(transform);
  dropStruct(playerCamera);
  dropStruct(targetRotation);

  sceneStruct.activeCamera = cameraId;
  inputStruct.enablePointerLock = true;
}
