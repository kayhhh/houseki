import { VRM } from "@pixiv/three-vrm";
import { AnimationAction, AnimationMixer } from "three";

export class VrmStore {
  /**
   * Entity ID -> VRM
   */
  readonly avatars = new Map<bigint, VRM>();

  /**
   * Vrm Entity ID -> Three.js AnimationMixer
   */
  readonly mixers = new Map<bigint, AnimationMixer>();

  /**
   *  VrmAnimation Entity ID -> Three.js AnimationAction
   */
  readonly actions = new Map<bigint, AnimationAction>();
}
