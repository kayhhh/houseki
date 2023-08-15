import { TransformControls as ThreeTransformControls } from "three/examples/jsm/controls/TransformControls";
import { struct } from "thyseus";

/**
 * A mock element we can pass into Three.js.
 * We use this to capture events from the ECS and pass them into TransformControls.
 */
class MockElement extends EventTarget {
  style = {};
  setPointerCapture() { }
  releasePointerCapture() { }
  clientWidth = 0;
  clientHeight = 0;
  ownerDocument = { pointerLockElement: null };
  getBoundingClientRect() {
    return {
      height: 0,
      left: 0,
      top: 0,
      width: 0,
    };
  }
}

export class TransformControlsStore {
  readonly mockElement = new MockElement();

  /**
   * Entity ID -> Three.js TransformControls object
   */
  readonly objects = new Map<bigint, ThreeTransformControls>();
}

@struct
export class CanvasRect {
  @struct.u32 declare x: number;
  @struct.u32 declare y: number;
  @struct.u32 declare width: number;
  @struct.u32 declare height: number;
  @struct.u32 declare left: number;
  @struct.u32 declare top: number;
}
