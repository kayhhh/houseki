import { Resource } from "@lattice-engine/core";
import { struct } from "thyseus";

@struct
export class Gltf {
  @struct.substruct(Resource) declare uri: Resource<string>;
}

@struct
export class Extra {
  @struct.u64 declare target: bigint;
  @struct.substruct(Resource) declare key: Resource<string>;
  @struct.substruct(Resource) declare value: Resource<string>;
}
