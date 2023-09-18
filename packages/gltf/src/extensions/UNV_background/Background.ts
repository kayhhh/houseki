import {
  ExtensionProperty,
  IProperty,
  Nullable,
  PropertyType,
  Texture,
  TextureInfo,
} from "@gltf-transform/core";

import { EXTENSION_NAME } from "./constants";

const PROPERTY_TYPE = "Background";

interface IBackground extends IProperty {
  texture: Texture;
  info: TextureInfo;
}

export class Background extends ExtensionProperty<IBackground> {
  static override readonly EXTENSION_NAME = EXTENSION_NAME;
  declare extensionName: typeof EXTENSION_NAME;
  declare propertyType: typeof PROPERTY_TYPE;
  declare parentTypes: [PropertyType.SCENE];

  protected init() {
    this.extensionName = EXTENSION_NAME;
    this.propertyType = PROPERTY_TYPE;
    this.parentTypes = [PropertyType.SCENE];
  }

  protected override getDefaults(): Nullable<IBackground> {
    return Object.assign(super.getDefaults() as IProperty, {
      info: new TextureInfo(this.graph),
      texture: null,
    });
  }

  getTexture(): Texture | null {
    return this.getRef("texture");
  }

  setTexture(texture: Texture | null): this {
    return this.setRef("texture", texture);
  }

  getInfo(): TextureInfo | null {
    return this.getTexture() ? this.getRef("info") : null;
  }
}
