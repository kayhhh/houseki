/// <reference types="../../troika.d.ts" />

import { RenderStore } from "@reddo/render";
import { Entity, Query, Res } from "thyseus";
import { Text as TroikaText } from "troika-three-text";

import { Text } from "../components";
import { TextStore } from "../resources";
import { AnchorX, AnchorY } from "../types";

// TODO: Figure out how to enable workaround
// Currently it breaks some other postprocessing effects,
// such as the outline effect used by the transform controls package
// https://github.com/protectwise/troika/tree/main/packages/troika-three-text#postprocessing

// OverrideMaterialManager.workaroundEnabled = true;

export function createText(
  renderStore: Res<RenderStore>,
  textStore: Res<TextStore>,
  entities: Query<[Entity, Text]>
) {
  const ids: bigint[] = [];

  for (const [entity, text] of entities) {
    ids.push(entity.id);

    let object = textStore.textObjects.get(entity.id);

    if (!object) {
      object = new TroikaText();
      textStore.textObjects.set(entity.id, object);
    }

    object.text = text.value;

    object.fontSize = text.fontSize;

    switch (text.anchorX) {
      case AnchorX.Left: {
        object.anchorX = "left";
        break;
      }

      case AnchorX.Center: {
        object.anchorX = "center";
        break;
      }

      case AnchorX.Right: {
        object.anchorX = "right";
        break;
      }
    }

    switch (text.anchorY) {
      case AnchorY.Top: {
        object.anchorY = "top";
        break;
      }

      case AnchorY.Middle: {
        object.anchorY = "middle";
        break;
      }

      case AnchorY.Bottom: {
        object.anchorY = "bottom";
        break;
      }
    }

    const colorR = text.color.at(0);
    const colorG = text.color.at(1);
    const colorB = text.color.at(2);
    object.color = `rgb(${colorR}, ${colorG}, ${colorB})`;

    const node = renderStore.nodes.get(entity.id);
    if (node) node.add(object as any);
  }

  // Remove text objects that are no longer in use
  for (const [id, object] of textStore.textObjects) {
    if (!ids.includes(id)) {
      object.removeFromParent();
      object.dispose();
      textStore.textObjects.delete(id);
    }
  }
}
