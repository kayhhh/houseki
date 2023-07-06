import { struct } from "thyseus";

@struct
export class TransformControls {
  @struct.u64 declare targetId: bigint;
}
