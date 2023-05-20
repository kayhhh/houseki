export class CoreStore {
  canvas: HTMLCanvasElement | null = null;

  /**
   * Entity ID of the active camera.
   */
  activeCamera: bigint | null = null;

  /**
   * Entity ID of the active scene.
   */
  activeScene: bigint | null = null;
}
