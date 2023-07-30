import { struct, type f32, type u16, type u8 } from "thyseus";

import { N8QualityMode } from "./types";

/**
 * Marks a scene as having an outline pass.
 */
@struct
export class OutlinePass {
  visibleEdgeColor: [f32, f32, f32] = [1, 1, 1];
  hiddenEdgeColor: [f32, f32, f32] = [0.3, 0.2, 0.2];

  opacity: f32 = 1;
  edgeStrength: f32 = 3;
  resolution: u16 = 1 - 24;
  multisampling: u8 = 4;
  xray: boolean = true;
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
  halfRes: boolean;
  debugMode: boolean;

  qualityMode: u8;

  aoRadius: f32;
  distanceFalloff: f32;
  instensity: f32;

  constructor(
    halfRes = true,
    debugMode = false,
    qualityMode = N8QualityMode.Medium,
    aoRadius = 2,
    distanceFalloff = 0.4,
    instensity = 1
  ) {
    this.halfRes = halfRes;
    this.debugMode = debugMode;
    this.qualityMode = qualityMode;
    this.aoRadius = aoRadius;
    this.distanceFalloff = distanceFalloff;
    this.instensity = instensity;
  }
}
