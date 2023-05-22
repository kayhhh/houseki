import { struct } from "thyseus";

@struct
export class Vrm {
  @struct.string declare uri: string;
}
