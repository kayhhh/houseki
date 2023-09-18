import { Node } from "@gltf-transform/core";
import { AnchorX, AnchorY, Text as TextComp } from "@houseki-engine/text";
import { Commands } from "thyseus";

import { Text } from "../extensions/MOZ_text/Text";

export function importText(commands: Commands, node: Node, entityId: bigint) {
  const ext = node.getExtension<Text>(Text.EXTENSION_NAME);
  if (!ext) return;

  const text = new TextComp();
  text.value = ext.getValue();
  text.font = ext.getFontFile();
  text.fontSize = ext.getSize();

  const color = ext.getColor();

  color[0] *= 255;
  color[1] *= 255;
  color[2] *= 255;

  text.color = [
    Math.round(color[0]),
    Math.round(color[1]),
    Math.round(color[2]),
  ];

  switch (ext.getAlignX()) {
    case "left": {
      text.anchorX = AnchorX.Left;
      break;
    }

    case "center": {
      text.anchorX = AnchorX.Center;
      break;
    }

    case "right": {
      text.anchorX = AnchorX.Right;
      break;
    }
  }

  switch (ext.getAlignY()) {
    case "top": {
      text.anchorY = AnchorY.Top;
      break;
    }

    case "middle": {
      text.anchorY = AnchorY.Middle;
      break;
    }

    case "bottom": {
      text.anchorY = AnchorY.Bottom;
      break;
    }
  }

  commands.getById(entityId).add(text);
}
