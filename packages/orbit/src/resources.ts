import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/**
 * A mock element we can pass into Three.js OrbitControls.
 * We use this to capture events from the ECS and pass them into OrbitControls.
 */
class MockElement extends EventTarget {
  style = {};
  setPointerCapture() {}
  releasePointerCapture() {}
  clientHeight = 0;
  clientWidth = 0;
}

export class OrbitControlsStore {
  readonly mockElement = new MockElement();

  /**
   * Entity ID -> Three.js OrbitControls object
   */
  readonly objects = new Map<bigint, OrbitControls>();
}
