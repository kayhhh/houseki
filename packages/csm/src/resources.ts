import { CSM } from "three/examples/jsm/csm/CSM";

export class CSMStore {
  /**
   * Entity ID -> CSM
   */
  readonly objects = new Map<bigint, CSM>();
}
