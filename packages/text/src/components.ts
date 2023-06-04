import { initStruct, struct } from "thyseus";

import { AnchorX, AnchorY } from "./types";

@struct
export class Text {
  @struct.string declare text: string;

  /**
   * URI to a font file (.ttf, .otf, .woff)
   */
  @struct.string declare font: string;
  @struct.f32 declare fontSize: number;

  @struct.u8 declare anchorX: AnchorX;
  @struct.u8 declare anchorY: AnchorY;

  @struct.u8 declare colorR: number;
  @struct.u8 declare colorG: number;
  @struct.u8 declare colorB: number;

  constructor(
    text = "",
    font = "",
    fontSize = 1,
    color: [number, number, number] = [255, 255, 255]
  ) {
    initStruct(this);

    this.text = text;
    this.font = font;
    this.fontSize = fontSize;
    this.anchorX = AnchorX.Center;
    this.anchorY = AnchorY.Middle;
    this.colorR = color[0];
    this.colorG = color[1];
    this.colorB = color[2];
  }
}
