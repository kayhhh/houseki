import { struct } from "thyseus";

@struct
export class SceneStruct {
  /**
   * Entity ID of the active camera.
   */
  @struct.u64 declare activeCamera: bigint;

  /**
   * Entity ID of the active scene.
   */
  @struct.u64 declare activeScene: bigint;
}
