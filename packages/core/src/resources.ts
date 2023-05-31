import { struct } from "thyseus";

export class CoreStore {
  /**
   * The canvas to render to.
   */
  canvas: HTMLCanvasElement | null = null;
}

@struct
export class MainLoopTime {
  @struct.f32 declare delta: number;
}
