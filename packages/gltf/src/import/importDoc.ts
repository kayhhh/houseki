import { Document } from "@gltf-transform/core";
import { Warehouse } from "@houseki-engine/core";
import {
  AnimationMixer,
  GlobalTransform,
  Name,
  Parent,
  Scene,
  SceneView,
  Transform,
} from "@houseki-engine/scene";
import { Commands, Entity } from "thyseus";

import { GltfInfo } from "../components";
import { ImportContext } from "./context";
import { importAnimation } from "./importAnimation";
import { importBackground } from "./importBackground";
import { importNode } from "./importNode";

export function importDoc(
  warehouse: Warehouse,
  doc: Document,
  entity: Readonly<Entity>,
  commands: Commands
) {
  const context = new ImportContext();

  const root = doc.getRoot();
  const defaultScene = root.getDefaultScene() ?? root.listScenes()[0];

  const info = new GltfInfo();
  const view = new SceneView();

  root.listScenes().map((gltfScene) => {
    const sceneEntityId = commands
      .spawn(true)
      .add(new Name(gltfScene.getName()))
      .addType(Parent)
      .addType(Transform)
      .addType(GlobalTransform)
      .addType(Scene).id;

    view.scenes.push(sceneEntityId);
    info.scenes.push(sceneEntityId);

    if (gltfScene === defaultScene) {
      view.active = sceneEntityId;
    }

    importBackground(warehouse, commands, gltfScene, sceneEntityId);

    gltfScene.listChildren().forEach((child) => {
      importNode(warehouse, child, sceneEntityId, commands, context);
    });
  });

  root.listAnimations().forEach((animation) => {
    importAnimation(animation, entity.id, commands, context);
  });

  if (root.listAnimations().length > 0) {
    const mixer = commands.getById(entity.id).addType(AnimationMixer);
    context.animationMixerIds.push(mixer.id);
  }

  root.listNodes().forEach((node) => {
    const entityId = context.nodes.get(node);
    if (!entityId) return;

    info.nodes.push(entityId);
  });

  root.listMeshes().forEach((mesh) => {
    const entityId = context.meshes.get(mesh);
    if (!entityId) return;

    info.meshes.push(entityId);

    const primitives = context.primitives.get(mesh);

    if (primitives) {
      info.meshPrimitives.push(...primitives);
      info.meshPrimitiveCounts.push(primitives.length);
    } else {
      info.meshPrimitiveCounts.push(0);
    }
  });

  root.listMaterials().forEach((material) => {
    const entityId = context.materials.get(material);
    if (!entityId) return;

    info.materials.push(entityId);
  });

  commands.get(entity).add(info).add(view);

  return context;
}
