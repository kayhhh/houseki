import { struct, type u64 } from "thyseus";

@struct
export class InputStruct {
  /**
   * Whether to enable pointer lock on the canvas.
   */
  enablePointerLock: boolean = false;

  /**
   * Whether the pointer is currently locked.
   */
  isPointerLocked: boolean = false;

  /**
   * Whether the pointer is currently down.
   */
  isPointerDown: boolean = false;

  /**
   * The currently pressed keys.
   */
  #keys: u64 = 0n;

  keyPressed(key: number): boolean {
    const bit = 1n << BigInt(key);
    return (this.#keys & bit) === bit;
  }

  setKeyPressed(key: number): void {
    this.#keys |= 1n << BigInt(key);
  }

  clearKeyPressed(key: number): void {
    if (this.keyPressed(key)) {
      this.#keys ^= 1n << BigInt(key);
    }
  }
}
