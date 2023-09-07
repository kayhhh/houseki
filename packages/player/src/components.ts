import { Vec3 } from "@reddo/core";
import { Quat } from "@reddo/scene";
import { type f32, struct, type u8, type u64 } from "thyseus";

import { PlayerCameraMode, PlayerCameraView } from "./types";

export class TargetTranslation extends Vec3 {}

export class TargetRotation extends Quat {}

@struct
export class PlayerBody {
  speed: f32;

  jumpStrength: f32;
  jumpTime: f32 = 0;

  spawnPoint: Vec3;

  /**
   * Stores how long the player has been in the air.
   */
  airTime: f32 = 0;

  /**
   * Teleport the player to spawn if they fall out of the world.
   */
  enableVoidTeleport: boolean;

  /**
   * The level below which the player will be teleported to spawn.
   */
  voidLevel: f32;

  constructor(
    speed = 4,
    jumpStrength = 4,
    spawnPoint: [number, number, number] = [0, 0, 0],
    enableVoidTeleport = true,
    voidLevel = -50
  ) {
    this.speed = speed;
    this.jumpStrength = jumpStrength;
    this.spawnPoint = new Vec3(...spawnPoint);
    this.enableVoidTeleport = enableVoidTeleport;
    this.voidLevel = voidLevel;
  }
}

/**
 * The player's avatar.
 * Should be a child of the player's body.
 */
@struct
export class PlayerAvatar {
  idleAnimation: string = "";
  idleAnimationId: u64 = 0n; // Entity ID

  jumpAnimation: string = "";
  jumpAnimationId: u64 = 0n; // Entity ID

  leftWalkAnimation: string = "";
  leftWalkAnimationId: u64 = 0n; // Entity ID

  rightWalkAnimation: string = "";
  rightWalkAnimationId: u64 = 0n; // Entity ID

  sprintAnimation: string = "";
  sprintAnimationId: u64 = 0n; // Entity ID

  walkAnimation: string = "";
  walkAnimationId: u64 = 0n; // Entity ID
}

/**
 * The player's camera.
 * Should be a child of the player's body.
 */
@struct
export class PlayerCamera {
  bodyId: u64 = 0n; // Entity ID

  /**
   * Whether the controls are for first person, third person, or both.
   */
  mode: u8 = 0;

  /**
   * The active view, either first person or third person.
   * This is only used when mode is set to both.
   */
  currentView: u8 = 0;

  /**
   * The distance of the camera from the player, when in third person mode.
   */
  distance: f32;
  targetDistance: f32;

  constructor(
    mode = PlayerCameraMode.Both,
    currentView = PlayerCameraView.FirstPerson,
    cameraDistance = 3
  ) {
    this.mode = mode;
    this.currentView =
      mode === PlayerCameraMode.ThirdPerson
        ? PlayerCameraView.ThirdPerson
        : currentView;
    this.distance = cameraDistance;
    this.targetDistance = cameraDistance;
  }
}
