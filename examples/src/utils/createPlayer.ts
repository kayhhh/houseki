import {
  CapsuleCollider,
  CharacterController,
  KinematicBody,
  Raycast,
  TargetTransform,
  Velocity,
} from "houseki/physics";
import {
  PlayerAvatar,
  PlayerBody,
  PlayerCamera,
  PlayerCameraMode,
  PlayerCameraView,
  TargetRotation,
  TargetTranslation,
} from "houseki/player";
import {
  GlobalTransform,
  Parent,
  PerspectiveCamera,
  SceneStruct,
  Transform,
} from "houseki/scene";
import { Vrm } from "houseki/vrm";
import { Commands } from "thyseus";

const PLAYER_HEIGHT = 1.6;
const PLAYER_WIDTH = 0.4;

export function createPlayer(
  spawn: [number, number, number],
  rootId: bigint,
  commands: Commands,
  sceneStruct: SceneStruct
) {
  const parent = new Parent();
  const transform = new Transform();

  const player = new PlayerBody();
  player.spawnPoint.fromArray(spawn);

  const targetTransform = new TargetTransform();
  const targetRotation = new TargetRotation(0, 0, 0, 1);
  const capsuleCollider = new CapsuleCollider(
    PLAYER_WIDTH,
    PLAYER_HEIGHT - PLAYER_WIDTH * 2
  );

  const bodyId = commands
    .spawn(true)
    .add(parent.setId(rootId))
    .add(transform.set(spawn))
    .add(targetTransform.set(spawn))
    .add(targetRotation)
    .addType(GlobalTransform)
    .addType(Velocity)
    .add(capsuleCollider)
    .addType(KinematicBody)
    .addType(CharacterController)
    .add(player).id;

  const playerAvatar = new PlayerAvatar();
  playerAvatar.idleAnimation = "/animation/Idle.fbx";
  playerAvatar.jumpAnimation = "/animation/Falling.fbx";
  playerAvatar.leftWalkAnimation = "/animation/LeftWalk.fbx";
  playerAvatar.rightWalkAnimation = "/animation/RightWalk.fbx";
  playerAvatar.sprintAnimation = "/animation/Sprint.fbx";
  playerAvatar.walkAnimation = "/animation/Walk.fbx";

  const vrm = new Vrm("/k-robot.vrm", true);

  commands
    .spawn(true)
    .add(transform.set([0, -PLAYER_HEIGHT / 2, 0]))
    .addType(GlobalTransform)
    .add(parent.setId(bodyId))
    .add(vrm)
    .add(playerAvatar);

  const playerCamera = new PlayerCamera(
    PlayerCameraMode.Both,
    PlayerCameraView.ThirdPerson
  );
  playerCamera.bodyId = bodyId;

  const cameraId = commands
    .spawn(true)
    .addType(Transform)
    .addType(GlobalTransform)
    .addType(TargetTranslation)
    .add(targetRotation)
    .addType(PerspectiveCamera)
    .add(playerCamera)
    .addType(Raycast).id;

  sceneStruct.activeCamera = cameraId;
}
