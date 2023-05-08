import { Document } from "@gltf-transform/core";
import { Warehouse } from "@lattice-engine/core";
import { Commands, Entity } from "thyseus";

import { LoadingContext } from "./context";
import { loadNode } from "./loadNode";

export function loadDoc(
  doc: Document,
  entity: Readonly<Entity>,
  commands: Commands,
  warehouse: Readonly<Warehouse>
) {
  const root = doc.getRoot();
  const scene = root.getDefaultScene() ?? root.listScenes()[0];
  if (!scene) return;

  const context = new LoadingContext();

  scene
    .listChildren()
    .forEach((child) =>
      loadNode(child, entity.id, commands, warehouse, context)
    );

  return context;
}
