import { Resource } from "@lattice-engine/core";
import { initStruct, struct } from "thyseus";

@struct
export class Vrm {
  /**
   * The URI of the VRM file to load.
   */
  @struct.substruct(Resource) declare uri: Resource<string>;

  /**
   * Whether to setup first person layers.
   */
  @struct.bool declare setupFirstPerson: boolean;

  constructor(setupFirstPerson = false) {
    initStruct(this);
    this.setupFirstPerson = setupFirstPerson;
  }
}

/**
 * Represents an animation applied to a VRM model.
 */
@struct
export class VrmAnimation {
  @struct.u64 declare vrmId: bigint; // Vrm Entity ID
  @struct.substruct(Resource) declare uri: Resource<string>;
  @struct.bool declare play: boolean;
  @struct.bool declare loop: boolean;
  @struct.f32 declare weight: number;
  @struct.f32 declare speed: number;

  constructor(vrmId = 0n, play = false, loop = false, weight = 1.0) {
    initStruct(this);

    this.vrmId = vrmId;
    this.play = play;
    this.loop = loop;
    this.weight = weight;
    this.speed = 1;
  }
}
