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

  const extension = context.doc.createExtension(MOZText);
  const property = extension.createText();

  property.setValue(text.value);
  property.setSize(text.fontSize);
  property.setFontFile(text.font);

  const color = [
    text.color[0] / 255,
    text.color[1] / 255,
    text.color[2] / 255,
    1,
  ] as [number, number, number, number];

  property.setColor(color);

  switch (text.anchorX) {
    case AnchorX.Left: {
      property.setAlignX("left");
      break;
    }

    case AnchorX.Center: {
      property.setAlignX("center");
      break;
    }

    case AnchorX.Right: {
      property.setAlignX("right");
      break;
    }
  }

  switch (text.anchorY) {
    case AnchorY.Top: {
      property.setAlignY("top");
      break;
    }

    case AnchorY.Middle: {
      property.setAlignY("middle");
      break;
    }

    case AnchorY.Bottom: {
      property.setAlignY("bottom");
      break;
    }
  }

  node.setExtension(property.extensionName, property);
}
