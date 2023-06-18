import { Document } from "@gltf-transform/core";
import { Warehouse } from "@lattice-engine/core";
import { AnimationMixer } from "@lattice-engine/scene";
import { Commands, Entity } from "thyseus";

import { ImportContext } from "./context";
import { importAnimation } from "./importAnimation";
import { importNode } from "./importNode";

export function importDoc(
  doc: Document,
  entity: Readonly<Entity>,
  commands: Commands,
  warehouse: Readonly<Warehouse>
) {
  const root = doc.getRoot();
  const scene = root.getDefaultScene() ?? root.listScenes()[0];
  if (!scene) return;

  const context = new ImportContext();

  scene
    .listChildren()
    .forEach((child) =>
      importNode(child, entity.id, commands, warehouse, context)
    );

  root
    .listAnimations()
    .forEach((animation) =>
      importAnimation(animation, entity.id, commands, warehouse, context)
    );

  if (root.listAnimations().length > 0) {
    const mixer = entity.addType(AnimationMixer);
    context.animationMixerIds.push(mixer.id);
  }

  context.dropStructs();

  return context;
}
