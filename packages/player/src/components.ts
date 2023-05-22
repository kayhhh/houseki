import { initStruct, struct } from "thyseus";

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
  @struct.f32 declare speed: number;
  @struct.f32 declare jumpStrength: number;

  @struct.substruct(Vec3) declare spawnPoint: Vec3;

  /**
   * Teleport the player to spawn if they fall out of the world.
   */
  @struct.bool declare enableVoidTeleport: boolean;
  @struct.f32 declare voidLevel: number;

  constructor(
    speed = 4,
    jumpStrength = 4,
    spawnPoint: [number, number, number] = [0, 0, 0],
    enableVoidTeleport = true,
    voidLevel = -50
  ) {
    initStruct(this);

    this.speed = speed;
    this.jumpStrength = jumpStrength;
    this.spawnPoint.set(...spawnPoint);
    this.enableVoidTeleport = enableVoidTeleport;
    this.voidLevel = voidLevel;
  }
}
