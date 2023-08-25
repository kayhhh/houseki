import { Resource } from "@lattice-engine/core";
import { initStruct, struct } from "thyseus";

import { AnchorX, AnchorY } from "./types";

@struct
export class Text {
  @struct.substruct(Resource) declare value: Resource<string>;

  /**
   * URI to a font file (.ttf, .otf, .woff)
   */
  @struct.substruct(Resource) declare font: Resource<string>;
  @struct.f32 declare fontSize: number;

  @struct.u8 declare anchorX: AnchorX;
  @struct.u8 declare anchorY: AnchorY;

  @struct.array({ length: 3, type: "u8" }) declare color: Uint8Array;

  constructor(fontSize = 1, color: [number, number, number] = [255, 255, 255]) {
    initStruct(this);

    this.fontSize = fontSize;
    this.anchorX = AnchorX.Center;
    this.anchorY = AnchorY.Middle;
    this.color.set(color);
  }
}
