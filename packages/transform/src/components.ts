import { struct, type u8, type u64 } from "thyseus";

@struct
export class TransformControls {
  targetId: u64 = 0n;
  mode: u8 = 0;
  enabled = true;
  outline = true;

  /**
   * Whether to clear events when dragging starts.
   * Useful when combining with other controls.
   */
  clearEvents = true;
}
