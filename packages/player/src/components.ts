import { Vec3 } from "@lattice-engine/core";
import { Quat } from "@lattice-engine/scene";
import { initStruct, struct } from "thyseus";

import { PlayerCameraMode, PlayerCameraView } from "./types";

export class TargetTranslation extends Vec3 {}

export class TargetRotation extends Quat {}

@struct
export class PlayerBody {
  @struct.f32 declare speed: number;

  @struct.f32 declare jumpStrength: number;
  @struct.f32 declare jumpTime: number;

  @struct.substruct(Vec3) declare spawnPoint: Vec3;

  /**
   * Stores how long the player has been in the air.
   */
  @struct.f32 declare airTime: number;

  /**
   * Teleport the player to spawn if they fall out of the world.
   */
  @struct.bool declare enableVoidTeleport: boolean;

  /**
   * The level below which the player will be teleported to spawn.
   */
  @struct.f32 declare voidLevel: number;

  constructor(
    speed = 4,
    jumpStrength = 4,
    spawnPoint: [number, number, number] = [0, 0, 0],
    enableVoidTeleport = true,
    voidLevel = -50,
  ) {
    initStruct(this);

    this.speed = speed;
    this.jumpStrength = jumpStrength;
    this.spawnPoint.fromArray(spawnPoint);
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
  @struct.string declare idleAnimation: string;
  @struct.u64 declare idleAnimationId: bigint; // Entity ID

  @struct.string declare jumpAnimation: string;
  @struct.u64 declare jumpAnimationId: bigint; // Entity ID

  @struct.string declare leftWalkAnimation: string;
  @struct.u64 declare leftWalkAnimationId: bigint; // Entity ID

  @struct.string declare rightWalkAnimation: string;
  @struct.u64 declare rightWalkAnimationId: bigint; // Entity ID

  @struct.string declare sprintAnimation: string;
  @struct.u64 declare sprintAnimationId: bigint; // Entity ID

  @struct.string declare walkAnimation: string;
  @struct.u64 declare walkAnimationId: bigint; // Entity ID
}

/**
 * The player's camera.
 * Should be a child of the player's body.
 */
@struct
export class PlayerCamera {
  @struct.u64 declare bodyId: bigint; // Entity ID

  /**
   * Whether the controls are for first person, third person, or both.
   */
  @struct.u8 declare mode: PlayerCameraMode;

  /**
   * The active view, either first person or third person.
   * This is only used when mode is set to both.
   */
  @struct.u8 declare currentView: PlayerCameraView;

  /**
   * The distance of the camera from the player, when in third person mode.
   */
  @struct.f32 declare distance: number;
  @struct.f32 declare targetDistance: number;

  constructor(
    mode = PlayerCameraMode.Both,
    currentView = PlayerCameraView.FirstPerson,
    cameraDistance = 3,
  ) {
    initStruct(this);

    this.mode = mode;
    this.currentView =
      mode === PlayerCameraMode.ThirdPerson
        ? PlayerCameraView.ThirdPerson
        : currentView;
    this.distance = cameraDistance;
    this.targetDistance = cameraDistance;
  }
}
