import { initStruct, struct } from "thyseus";

import { PlayerControlsMode, PlayerControlsView } from "./types";

@struct
class Vec3 {
  @struct.array({ length: 3, type: "f32" }) declare value: Float32Array;

  set(x: number, y: number, z: number) {
    this.value[0] = x;
    this.value[1] = y;
    this.value[2] = z;
  }

  array() {
    return [this.value[0], this.value[1], this.value[2]] as [
      number,
      number,
      number
    ];
  }
}

@struct
export class PlayerControls {
  /**
   * Whether the controls are for first person, third person, or both.
   * @type {PlayerControlsMode}
   */
  @struct.u8 declare mode: number;

  /**
   * The active view, either first person or third person.
   * This is only used when mode is set to both.
   * @type {PlayerControlsView}
   */
  @struct.u8 declare currentView: number;

  @struct.f32 declare speed: number;
  @struct.f32 declare jumpStrength: number;
  @struct.substruct(Vec3) declare spawnPoint: Vec3;

  /**
   * Teleport the player to spawn if they fall out of the world.
   */
  @struct.bool declare enableVoidTeleport: boolean;

  /**
   * The level below which the player will be teleported to spawn.
   */
  @struct.f32 declare voidLevel: number;

  constructor(
    mode = PlayerControlsMode.Both,
    currentView = PlayerControlsView.FirstPerson,
    speed = 4,
    jumpStrength = 4,
    spawnPoint: [number, number, number] = [0, 0, 0],
    enableVoidTeleport = true,
    voidLevel = -50
  ) {
    initStruct(this);

    this.mode = mode;
    this.currentView = currentView;
    this.speed = speed;
    this.jumpStrength = jumpStrength;
    this.spawnPoint.set(...spawnPoint);
    this.enableVoidTeleport = enableVoidTeleport;
    this.voidLevel = voidLevel;
  }
}
