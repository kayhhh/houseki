import { Resource } from "@lattice-engine/core";
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
  @struct.substruct(Resource) declare uri: Resource<string>;
  @struct.bool declare binary: boolean;
}
