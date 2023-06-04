/// <reference types="../../troika.d.ts" />

import { RenderStore } from "@lattice-engine/render";
import { Entity, Query, Res } from "thyseus";
import { Text as TroikaText } from "troika-three-text";

import { Text } from "../components";
import { TextStore } from "../resources";
import { AnchorX, AnchorY } from "../types";

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

    object.text = text.text;
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

      case AnchorY.TopBaseline: {
        object.anchorY = "top-baseline";
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

      case AnchorY.BottomBaseline: {
        object.anchorY = "bottom-baseline";
        break;
      }
    }

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
