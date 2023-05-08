import { Resource } from "@lattice-engine/core";
import { struct } from "thyseus";

@struct
export class GltfUri {
  @struct.substruct(Resource) declare uri: Resource<string>;
}
