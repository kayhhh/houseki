import { initStruct, struct } from "thyseus";

/**
 * Marks a scene as having an outline pass.
 */
@struct
export class OutlinePass {
  @struct.array({ length: 3, type: "f32" })
  declare visibleEdgeColor: Float32Array;
  @struct.array({ length: 3, type: "f32" })
  declare hiddenEdgeColor: Float32Array;

  @struct.f32 declare opacity: number;
  @struct.f32 declare edgeStrength: number;
  @struct.u16 declare resolution: number;
  @struct.u8 declare multisampling: number;
  @struct.bool declare xray: boolean;

  constructor() {
    initStruct(this);

    this.visibleEdgeColor.set([1, 1, 1]);
    this.hiddenEdgeColor.set([0.3, 0.2, 0.2]);
    this.opacity = 1;
    this.edgeStrength = 3;
    this.resolution = 1024;
    this.multisampling = 4;
    this.xray = true;
  }
}

/**
 * Marks a node as a target for the outline pass.
 */
@struct
export class OutlineTarget {}
