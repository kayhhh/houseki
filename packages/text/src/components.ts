import { type f32, struct, type u8 } from "thyseus";

import { AnchorX, AnchorY } from "./types";

@struct
export class Text {
  value: string;

  /**
   * URI to a font file (.ttf, .otf, .woff)
   */
  font: string;
  fontSize: f32;

  anchorX: u8;
  anchorY: u8;

  color: [u8, u8, u8];

  constructor(
    value = "",
    font = "",
    fontSize = 1,
    color: [u8, u8, u8] = [255, 255, 255]
  ) {
    this.value = value;
    this.font = font;
    this.fontSize = fontSize;
    this.anchorX = AnchorX.Center;
    this.anchorY = AnchorY.Middle;
    this.color = [...color];
  }
}
