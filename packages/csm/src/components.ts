import { f32, struct, u8, u16 } from "thyseus";

@struct
export class CascadingShadowMaps {
  fade: boolean = true;
  far: f32 = 40;
  lightIntensity: f32 = 1;
  shadowBias: f32 = -0.00007;
  shadowMapSize: u16 = 2048;
  cascades: u8 = 2;
}
