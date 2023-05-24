import { initStruct, struct } from "thyseus";

@struct
export class Vrm {
  /**
   * The URI of the VRM file to load.
   */
  @struct.string declare uri: string;

  /**
   * Whether to setup first person layers.
   */
  @struct.bool declare firstPerson: boolean;

  constructor(uri = "", firstPerson = false) {
    initStruct(this);

    this.uri = uri;
    this.firstPerson = firstPerson;
  }
}
