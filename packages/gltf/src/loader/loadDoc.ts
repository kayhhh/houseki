import { Document } from "@gltf-transform/core";
import { Commands, Entity } from "thyseus";

import { loadNode } from "./loadNode";

export function loadDoc(
  doc: Document,
  entity: Readonly<Entity>,
  commands: Commands
) {
  const root = doc.getRoot();
  const scene = root.getDefaultScene() ?? root.listScenes()[0];
  if (!scene) return;

  scene.listChildren().forEach((child) => loadNode(child, entity, commands));
}
