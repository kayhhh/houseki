import { struct, type u64 } from "thyseus";

@struct
export class ExportGltf {
  binary = true;
  scene: u64 = 0n;
}

@struct
export class ExportedGltf {
  uri = "";
  binary = false;
}
