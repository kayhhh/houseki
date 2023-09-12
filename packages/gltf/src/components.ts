import { struct, type u64 } from "thyseus";

@struct
export class Gltf {
  uri: string;

  constructor(uri = "") {
    this.uri = uri;
  }
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
  nodes: u64[] = [];
  meshes: u64[] = [];
  materials: u64[] = [];
}
