import { struct } from "thyseus";

import { NUM_KEYS } from "./types";

@struct
export class InputStruct {
  /**
   * Whether to enable pointer lock on the canvas.
   */
  @struct.bool declare enablePointerLock: boolean;

  /**
   * Whether the pointer is currently locked.
   */
  @struct.bool declare isPointerLocked: boolean;

  /**
   * Whether the pointer is currently down.
   */
  @struct.bool declare isPointerDown: boolean;

  /**
   * The currently pressed keys.
   * Each index is a `Key` enum value.
   * The value is `1` if the key is pressed, `0` otherwise.
   */
  @struct.array({ length: NUM_KEYS, type: "u8" }) declare keys: Uint8Array;

  keyPressed(key: number): boolean {
    return this.keys[key] === 1;
  }
}
