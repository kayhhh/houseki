import { struct, u8, u16, type u64 } from "thyseus";

@struct
export class Gltf {
  uri: string;

  constructor(uri = "") {
    this.uri = uri;
  }
}

@struct
export class SubScene {
  nodes: u64[] = [];
}

@struct
export class SceneView {
  active: u64 = 0n;
  scenes: u64[] = [];
}

@struct
export class Extra {
  target: u64;

  key: string;
  value: string;

  constructor(key = "", value = "") {
    this.target = 0n;
    this.key = key;
    this.value = value;
  }
}

@struct
export class GltfInfo {
  defaultScene: u8 = 0;
  scenes: u64[] = [];
  nodes: u64[] = [];
  meshes: u64[] = [];
  meshPrimitives: u64[] = [];
  /**
   * The number of primitives in each mesh.
   */
  meshPrimitiveCounts: u16[] = [];
  materials: u64[] = [];
}
