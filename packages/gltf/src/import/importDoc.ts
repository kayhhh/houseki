import { Document } from "@gltf-transform/core";
import { Warehouse } from "@houseki-engine/core";
import { AnimationMixer } from "@houseki-engine/scene";
import { Commands, Entity } from "thyseus";

import { GltfInfo } from "../components";
import { ImportContext } from "./context";
import { importAnimation } from "./importAnimation";
import { importNode } from "./importNode";

export function importDoc(
  warehouse: Warehouse,
  doc: Document,
  entity: Readonly<Entity>,
  commands: Commands
) {
  const root = doc.getRoot();
  const scene = root.getDefaultScene() ?? root.listScenes()[0];
  if (!scene) return;

  const context = new ImportContext();

  scene
    .listChildren()
    .forEach((child) =>
      importNode(warehouse, child, entity.id, commands, context)
    );

  root
    .listAnimations()
    .forEach((animation) =>
      importAnimation(animation, entity.id, commands, context)
    );

  if (root.listAnimations().length > 0) {
    const mixer = commands.get(entity).addType(AnimationMixer);
    context.animationMixerIds.push(mixer.id);
  }

  // Set indices
  const info = new GltfInfo();

  root.listNodes().forEach((node) => {
    const entityId = context.nodes.get(node);
    if (!entityId) return;
    info.nodes.push(entityId);
  });

  root.listMeshes().forEach((mesh) => {
    const entityId = context.meshes.get(mesh);
    if (!entityId) return;
    info.meshes.push(entityId);
  });

  root.listMaterials().forEach((material) => {
    const entityId = context.materials.get(material);
    if (!entityId) return;
    info.materials.push(entityId);
  });

  commands.get(entity).add(info);

  return context;
}
