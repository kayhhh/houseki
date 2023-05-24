import { VRM } from "@pixiv/three-vrm";

export class VrmStore {
  /**
   * Entity ID -> VRM
   */
  readonly avatars = new Map<bigint, VRM>();
}
