import { initStruct, struct } from "thyseus";

@struct
export class CascadingShadowMaps {
  @struct.bool declare fade: boolean;
  @struct.f32 declare far: number;
  @struct.f32 declare lightIntensity: number;
  @struct.f32 declare shadowBias: number;
  @struct.u16 declare shadowMapSize: number;
  @struct.u8 declare cascades: number;

  constructor() {
    initStruct(this);

    this.fade = true;
    this.far = 40;
    this.lightIntensity = 1;
    this.shadowBias = -0.00007;
    this.shadowMapSize = 2048;
    this.cascades = 2;
  }
}
