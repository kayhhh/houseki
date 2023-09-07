import { AnchorX, AnchorY, Text } from "@reddo/text";

import { MOZText } from "../extensions/MOZ_text/MOZText";
import { ExportContext } from "./context";

export function exportText(
  context: ExportContext,
  entityId: bigint,
  text: Text
) {
  const node = context.nodes.get(entityId);
  if (!node) return;

  const textExtension = context.doc.createExtension(MOZText);
  const textProp = textExtension.createText();

  const value = text.value;
  const font = text.font;

  textProp.setValue(value);
  textProp.setSize(text.fontSize);
  textProp.setFontFile(font);

  const color = [
    (text.color.at(0) ?? 0) / 255,
    (text.color.at(1) ?? 0) / 255,
    (text.color.at(2) ?? 0) / 255,
    1,
  ] as [number, number, number, number];

  textProp.setColor(color);

  switch (text.anchorX) {
    case AnchorX.Left: {
      textProp.setAlignX("left");
      break;
    }

    case AnchorX.Center: {
      textProp.setAlignX("center");
      break;
    }

    case AnchorX.Right: {
      textProp.setAlignX("right");
      break;
    }
  }

  switch (text.anchorY) {
    case AnchorY.Top: {
      textProp.setAlignY("top");
      break;
    }

    case AnchorY.Middle: {
      textProp.setAlignY("middle");
      break;
    }

    case AnchorY.Bottom: {
      textProp.setAlignY("bottom");
      break;
    }
  }

  node.setExtension(MOZText.EXTENSION_NAME, textProp);
}
