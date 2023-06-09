import { struct } from "thyseus";

@struct
export class DeepRemove {
  @struct.u64 declare rootId: bigint;
}
