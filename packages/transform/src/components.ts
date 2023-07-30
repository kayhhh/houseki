import { struct, type u64, type u8 } from "thyseus";

import { TransformMode } from "./types";

@struct
export class TransformControls {
  targetId: u64 = 0n;
  mode: u8 = 0;
  enabled: boolean = true;
  outline: boolean = true;

  /**
   * Whether to clear events when dragging starts.
   * Useful when combining with other controls.
   */
  clearEvents: boolean = true;
}
