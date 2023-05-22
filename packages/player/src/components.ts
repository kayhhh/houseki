import { initStruct, struct } from "thyseus";

@struct
export class PlayerControls {
  /**
   * The spawn point of the player.
   */
  @struct.array({ length: 3, type: "f32" }) declare spawnPoint: Float32Array;

  /**
   * Teleport the player to spawn if they fall out of the world.
   */
  @struct.bool declare enableVoidTeleport: boolean;

  /**
   * The level of the void.
   */
  @struct.f32 declare voidLevel: number;

  constructor(
    spawnPoint: [number, number, number] = [0, 0, 0],
    enableVoidTeleport = true,
    voidLevel = -50
  ) {
    initStruct(this);

    this.spawnPoint[0] = spawnPoint[0];
    this.spawnPoint[1] = spawnPoint[1];
    this.spawnPoint[2] = spawnPoint[2];

    this.enableVoidTeleport = enableVoidTeleport;
    this.voidLevel = voidLevel;
  }
}
