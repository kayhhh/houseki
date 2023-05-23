import { initStruct, struct } from "thyseus";

@struct
export class Vrm {
  @struct.string declare uri: string;

  constructor(uri = "") {
    initStruct(this);

    this.uri = uri;
  }
}
