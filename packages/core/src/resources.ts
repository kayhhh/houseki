import { struct } from "thyseus";

export class CoreStore {
  /**
   * The canvas to render to.
   */
  canvas: HTMLCanvasElement | null = null;
}

@struct
export class CoreStruct {
  /**
   * Entity ID of the active camera.
   */
  @struct.u64 declare activeCamera: bigint;

  /**
   * Entity ID of the active scene.
   */
  @struct.u64 declare activeScene: bigint;
}
