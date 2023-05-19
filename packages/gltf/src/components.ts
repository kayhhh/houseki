import { struct } from "thyseus";

@struct
export class GltfUri {
  @struct.string declare uri: string;
}
