import { Extension, ReaderContext, WriterContext } from "@gltf-transform/core";

import { Background } from "./Background";
import { EXTENSION_NAME } from "./constants";
import { SceneBackgroundExtension, SceneBackgroundSchema } from "./schemas";

/**
 * Implementation of the UNV_background extension.
 */
export class UNVBackground extends Extension {
  static override readonly EXTENSION_NAME = EXTENSION_NAME;
  override readonly extensionName = EXTENSION_NAME;

  createBackground(): Background {
    return new Background(this.document.getGraph());
  }

  public read(context: ReaderContext): this {
    const jsonDoc = context.jsonDoc;

    const texturesJson = jsonDoc.json.textures ?? [];
    const scenesJson = jsonDoc.json.scenes ?? [];

    scenesJson.forEach((sceneJson, i) => {
      if (!sceneJson.extensions) return;

      const parsedBackground = SceneBackgroundSchema.safeParse(
        sceneJson.extensions[EXTENSION_NAME]
      );
      if (!parsedBackground.success) return;

      const infoJson = parsedBackground.data.texture;
      if (!infoJson) return;

      const textureJson = texturesJson[infoJson.index];
      if (!textureJson) return;

      const source = textureJson.source;
      if (source === undefined) return;

      const texture = context.textures[source];
      if (!texture) return;

      const background = this.createBackground();
      background.setTexture(texture);

      const textureInfo = background.getInfo();
      if (!textureInfo) {
        console.warn("Texture info not found");
        return;
      }

      context.setTextureInfo(textureInfo, infoJson);

      const scene = context.scenes[i];
      if (!scene) {
        console.warn("Scene not found");
        return;
      }

      scene.setExtension(EXTENSION_NAME, background);
    });

    return this;
  }

  public write(context: WriterContext): this {
    this.document
      .getRoot()
      .listScenes()
      .forEach((scene) => {
        const background = scene.getExtension<Background>(EXTENSION_NAME);

        if (background) {
          const sceneIndex = context.sceneIndexMap.get(scene);
          if (sceneIndex === undefined) return;

          const sceneJson = context.jsonDoc.json.scenes?.[sceneIndex];
          if (!sceneJson) return;

          const texture = background.getTexture();
          const textureInfo = background.getInfo();

          if (!texture || !textureInfo) {
            return;
          }

          sceneJson.extensions ??= {};

          const extensionJson: SceneBackgroundExtension = {
            texture: context.createTextureInfoDef(texture, textureInfo),
          };

          sceneJson.extensions[EXTENSION_NAME] = extensionJson;
        }
      });

    return this;
  }
}
