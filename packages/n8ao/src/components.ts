import { initStruct, struct } from "thyseus";

import { QualityMode } from "./types";

@struct
export class N8AOPass {
  @struct.bool declare halfRes: boolean;
  @struct.bool declare debugMode: boolean;

  @struct.u8 declare qualityMode: QualityMode;

  @struct.f32 declare aoRadius: number;
  @struct.f32 declare distanceFalloff: number;
  @struct.f32 declare instensity: number;

  constructor(
    halfRes = true,
    debugMode = false,
    qualityMode = QualityMode.Medium,
    aoRadius = 2,
    distanceFalloff = 0.4,
    instensity = 1
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
