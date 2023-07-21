import { initStruct, struct } from "thyseus";

@struct
export class Gltf {
  @struct.string declare uri: string;

  constructor(uri = "") {
    initStruct(this);

    this.uri = uri;
  }
}

@struct
export class Extra {
  @struct.u64 declare target: bigint;

  @struct.string declare key: string;
  @struct.string declare value: string;

  constructor(key = "", value = "") {
    initStruct(this);

    this.key = key;
    this.value = value;
  }
}
