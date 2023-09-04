import { struct, type u64 } from "thyseus";

@struct
export class SceneStruct {
  /**
   * Entity ID of the active camera.
   */
  activeCamera: u64 = 0n;

  /**
   * Entity ID of the active scene.
   */
  activeScene: u64 = 0n;
}
