import { type f32, struct } from "thyseus";

export class CoreStore {
  /**
   * The canvas to render to.
   */
  canvas: HTMLCanvasElement | null = null;
}

@struct
export class Time {
  mainTime: f32 = 0;
  mainDelta: f32 = 0;

  fixedTime: f32 = 0;
  fixedDelta: f32 = 0;
}
