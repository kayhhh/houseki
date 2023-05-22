import { struct } from "thyseus";

@struct
export class Gltf {
  @struct.string declare uri: string;
}
