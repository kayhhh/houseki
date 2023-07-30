import { TransformControls as ThreeTransformControls } from "three/examples/jsm/controls/TransformControls";
import { struct, type u32 } from "thyseus";

/**
 * A mock element we can pass into Three.js.
 * We use this to capture events from the ECS and pass them into TransformControls.
 */
class MockElement extends EventTarget {
  style = {};
  setPointerCapture() {}
  releasePointerCapture() {}
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
  x: u32 = 0;
  y: u32 = 0;
  width: u32 = 0;
  height: u32 = 0;
  left: u32 = 0;
  top: u32 = 0;
}
