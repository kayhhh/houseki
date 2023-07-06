import {
  ExtensionProperty,
  IProperty,
  Nullable,
  PropertyType,
} from "@gltf-transform/core";

import { EXTENSION_NAME } from "./constants";

interface IText extends IProperty {
  value: string;
  color: [number, number, number, number];
  size: number;
  fontFile: string;
  alignX: "left" | "center" | "right";
  alignY: "top" | "middle" | "bottom";
}

export class Text extends ExtensionProperty<IText> {
  static override readonly EXTENSION_NAME = EXTENSION_NAME;
  declare extensionName: typeof EXTENSION_NAME;
  declare propertyType: "Text";
  declare parentTypes: [PropertyType.NODE];

  protected init() {
    this.extensionName = EXTENSION_NAME;
    this.propertyType = "Text";
    this.parentTypes = [PropertyType.NODE];
  }

  protected override getDefaults(): Nullable<IText> {
    return Object.assign(super.getDefaults(), {
      alignX: "left",
      alignY: "top",
      color: [1, 1, 1, 1],
      fontFile: "",
      size: 1,
      value: "",
    });
  }

  getValue() {
    return this.get("value");
  }

  setValue(value: string) {
    return this.set("value", value);
  }

  getColor() {
    return this.get("color");
  }

  setColor(color: [number, number, number, number]) {
    return this.set("color", color);
  }

  getSize() {
    return this.get("size");
  }

  setSize(size: number) {
    return this.set("size", size);
  }

  getFontFile() {
    return this.get("fontFile");
  }

  setFontFile(fontFile: string) {
    return this.set("fontFile", fontFile);
  }

  getAlignX() {
    return this.get("alignX");
  }

  setAlignX(alignX: "left" | "center" | "right") {
    return this.set("alignX", alignX);
  }

  getAlignY() {
    return this.get("alignY");
  }

  setAlignY(alignY: "top" | "middle" | "bottom") {
    return this.set("alignY", alignY);
  }
}
