import { struct } from "thyseus";

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
}
