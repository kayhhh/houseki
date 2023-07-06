import { struct } from "thyseus";

import { TransformMode } from "./types";

@struct
export class TransformControls {
  @struct.u64 declare targetId: bigint;
  @struct.u8 declare mode: TransformMode;
}
