import { initStruct, struct } from "thyseus";

@struct
export class ExportGltf {
  @struct.bool declare binary: boolean;
  @struct.u64 declare scene: bigint;

  constructor() {
    initStruct(this);

    this.binary = true;
  }
}

@struct
export class ExportedGltf {
  @struct.string declare uri: string;
  @struct.bool declare binary: boolean;
}
