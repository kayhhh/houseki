import { initStruct, struct } from "thyseus";

@struct
export class Vrm {
  /**
   * The URI of the VRM file to load.
   */
  @struct.string declare uri: string;

  constructor(uri = "") {
    initStruct(this);

    this.uri = uri;
  }
}
