import { initStruct, struct } from "thyseus";

import { N8QualityMode } from "./types";

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

/**
 * Marks a scene as having a n8ao pass.
 */
@struct
export class N8AOPass {
  @struct.bool declare halfRes: boolean;
  @struct.bool declare debugMode: boolean;

  @struct.u8 declare qualityMode: N8QualityMode;

  @struct.f32 declare aoRadius: number;
  @struct.f32 declare distanceFalloff: number;
  @struct.f32 declare instensity: number;

  constructor(
    halfRes = true,
    debugMode = false,
    qualityMode = N8QualityMode.Medium,
    aoRadius = 2,
    distanceFalloff = 0.4,
    instensity = 1,
  ) {
    initStruct(this);

    this.halfRes = halfRes;
    this.debugMode = debugMode;
    this.qualityMode = qualityMode;
    this.aoRadius = aoRadius;
    this.distanceFalloff = distanceFalloff;
    this.instensity = instensity;
  }
}
