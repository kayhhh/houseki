import { initStruct, struct } from "thyseus";

import { TransformMode } from "./types";

@struct
export class TransformControls {
  @struct.u64 declare targetId: bigint;
  @struct.u8 declare mode: TransformMode;
  @struct.bool declare enabled: boolean;
  @struct.bool declare outline: boolean;

  /**
   * Whether to clear events when dragging starts.
   * Useful when combining with other controls.
   */
  @struct.bool declare clearEvents: boolean;

  constructor() {
    initStruct(this);

    this.enabled = true;
    this.outline = true;
    this.clearEvents = true;
  }
}
