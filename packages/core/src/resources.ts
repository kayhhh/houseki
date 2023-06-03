import { struct } from "thyseus";

export class CoreStore {
  /**
   * The canvas to render to.
   */
  canvas: HTMLCanvasElement | null = null;
}

@struct
export class Time {
  @struct.f32 declare mainTime: number;
  @struct.f32 declare mainDelta: number;

  @struct.f32 declare fixedTime: number;
  @struct.f32 declare fixedDelta: number;
}
