import { Extension, ReaderContext, WriterContext } from "@gltf-transform/core";

import { EXTENSION_NAME } from "./constants";
import { TextDef, textSchema } from "./schemas";
import { Text } from "./Text";

/**
 * Implementation of the {@link https://github.com/MozillaReality/MOZ_text MOZ_Text} extension.
 */
export class MOZText extends Extension {
  static override readonly EXTENSION_NAME = EXTENSION_NAME;
  override readonly extensionName = EXTENSION_NAME;

  createText() {
    return new Text(this.document.getGraph());
  }

  read(context: ReaderContext): this {
    const nodeDefs = context.jsonDoc.json.nodes ?? [];

    nodeDefs.forEach((nodeDef, nodeIndex) => {
      if (!nodeDef.extensions || !nodeDef.extensions[this.extensionName])
        return;

      const node = context.nodes[nodeIndex];
      if (!node) return;

      const parsedText = textSchema.safeParse(
        nodeDef.extensions[this.extensionName]
      );

      if (!parsedText.success) {
        console.warn(parsedText.error);
        return;
      }

      const text = this.createText();
      text.setValue(parsedText.data.value);

      if (parsedText.data.fontFile) {
        text.setFontFile(parsedText.data.fontFile);
      }

      if (parsedText.data.size !== undefined) {
        text.setSize(parsedText.data.size);
      }

      if (parsedText.data.color) {
        text.setColor(parsedText.data.color);
      }

      if (parsedText.data.alignX) {
        text.setAlignX(parsedText.data.alignX);
      }

      if (parsedText.data.alignY) {
        text.setAlignY(parsedText.data.alignY);
      }

      node.setExtension(this.extensionName, text);
    });

    return this;
  }

  write(context: WriterContext): this {
    if (this.properties.size === 0) return this;

    this.document
      .getRoot()
      .listNodes()
      .forEach((node) => {
        const text = node.getExtension<Text>(Text.EXTENSION_NAME);
        if (!text) return;

        const nodeIndex = context.nodeIndexMap.get(node);
        if (nodeIndex === undefined) throw new Error("Node index not found");

        const nodes = context.jsonDoc.json.nodes;
        if (!nodes) throw new Error("Nodes not found");

        const nodeDef = nodes[nodeIndex];
        if (!nodeDef) throw new Error("Node def not found");

        nodeDef.extensions ??= {};

        const colliderDef: TextDef = {
          alignX: text.getAlignX(),
          alignY: text.getAlignY(),
          color: text.getColor(),
          fontFile: text.getFontFile(),
          size: text.getSize(),
          value: text.getValue(),
        };

        nodeDef.extensions[this.extensionName] = colliderDef;
      });

    return this;
  }
}
