import { AnchorX, AnchorY, Text } from "@houseki-engine/text";

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

  textProp.setValue(text.value);
  textProp.setSize(text.fontSize);
  textProp.setFontFile(text.font);

  const color = [
    text.color[0] / 255,
    text.color[1] / 255,
    text.color[2] / 255,
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
