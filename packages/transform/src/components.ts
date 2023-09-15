import { struct, type u8, type u64 } from "thyseus";

@struct
export class TransformControls {
  targetId: u64 = 0n;
  mode: u8 = 0;
  enabled: boolean = true;
  outline: boolean = true;

  dragging: boolean = false;

  /**
   * Whether to clear events when dragging starts.
   * Useful when combining with other controls.
   */
  clearEvents: boolean = true;
}
