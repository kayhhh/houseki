import { Document } from "@gltf-transform/core";
import { Warehouse } from "@lattice-engine/core";
import { AnimationMixer } from "@lattice-engine/scene";
import { Commands, Entity } from "thyseus";

import { LoadingContext } from "./context";
import { loadAnimation } from "./loadAnimation";
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

  root
    .listAnimations()
    .forEach((animation) =>
      loadAnimation(animation, entity, commands, warehouse, context)
    );

  if (root.listAnimations().length > 0) {
    const mixer = entity.addType(AnimationMixer);
    context.animationMixers.push(mixer.id);
  }

  return context;
}
