import { initStruct, struct } from "thyseus";

import { AnchorX, AnchorY } from "./types";

@struct
export class Text {
  @struct.string declare value: string;

  /**
   * URI to a font file (.ttf, .otf, .woff)
   */
  @struct.string declare font: string;
  @struct.f32 declare fontSize: number;

  @struct.u8 declare anchorX: AnchorX;
  @struct.u8 declare anchorY: AnchorY;

  @struct.array({ length: 3, type: "u8" }) declare color: Uint8Array;

  constructor(
    value = "",
    font = "",
    fontSize = 1,
    color: [number, number, number] = [255, 255, 255],
  ) {
    initStruct(this);

    this.value = value;
    this.font = font;
    this.fontSize = fontSize;
    this.anchorX = AnchorX.Center;
    this.anchorY = AnchorY.Middle;
    this.color.set(color);
  }
}
