import { Node } from "@gltf-transform/core";
import { AnchorX, AnchorY, Text as TextComp } from "@houseki-engine/text";
import { Commands } from "thyseus";

import { Text } from "../extensions/MOZ_text/Text";

export function importText(commands: Commands, node: Node, entityId: bigint) {
  const text = node.getExtension<Text>(Text.EXTENSION_NAME);
  if (!text) return;

  const textComp = new TextComp();
  textComp.value = text.getValue();
  textComp.font = text.getFontFile();
  textComp.fontSize = text.getSize();

  const color = text.getColor();

  color[0] *= 255;
  color[1] *= 255;
  color[2] *= 255;

  textComp.color = [
    Math.round(color[0]),
    Math.round(color[1]),
    Math.round(color[2]),
  ];

  switch (text.getAlignX()) {
    case "left": {
      textComp.anchorX = AnchorX.Left;
      break;
    }

    case "center": {
      textComp.anchorX = AnchorX.Center;
      break;
    }

    case "right": {
      textComp.anchorX = AnchorX.Right;
      break;
    }
  }

  switch (text.getAlignY()) {
    case "top": {
      textComp.anchorY = AnchorY.Top;
      break;
    }

    case "middle": {
      textComp.anchorY = AnchorY.Middle;
      break;
    }

    case "bottom": {
      textComp.anchorY = AnchorY.Bottom;
      break;
    }
  }

  commands.getById(entityId).add(textComp);
}
