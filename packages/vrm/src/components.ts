import { type f32, struct, type u64 } from "thyseus";

@struct
export class Vrm {
  /**
   * The URI of the VRM file to load.
   */
  uri: string;

  /**
   * Whether to setup first person layers.
   */
  setupFirstPerson: boolean;

  constructor(uri = "", setupFirstPerson = false) {
    this.uri = uri;
    this.setupFirstPerson = setupFirstPerson;
  }
}

/**
 * Represents an animation applied to a VRM model.
 */
@struct
export class VrmAnimation {
  vrmId: u64; // Vrm Entity ID
  uri: string;
  play: boolean;
  loop: boolean;
  weight: f32;
  speed: f32;

  constructor(vrmId = 0n, uri = "", play = false, loop = false, weight = 1.0) {
    this.vrmId = vrmId;
    this.uri = uri;
    this.play = play;
    this.loop = loop;
    this.weight = weight;
    this.speed = 1;
  }
}
