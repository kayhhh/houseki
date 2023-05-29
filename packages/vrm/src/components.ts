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
  @struct.bool declare setupFirstPerson: boolean;

  constructor(uri = "", setupFirstPerson = false) {
    initStruct(this);

    this.uri = uri;
    this.setupFirstPerson = setupFirstPerson;
  }
}

/**
 * Represents an animation applied to a VRM model.
 */
@struct
export class VrmAnimation {
  @struct.u64 declare vrmId: bigint; // Vrm Entity ID

  @struct.string declare uri: string;

  @struct.bool declare play: boolean;

  @struct.bool declare loop: boolean;

  @struct.f32 declare weight: number;

  constructor(vrmId = 0n, uri = "", play = false, loop = false, weight = 1.0) {
    initStruct(this);

    this.vrmId = vrmId;
    this.uri = uri;
    this.play = play;
    this.loop = loop;
    this.weight = weight;
  }
}
