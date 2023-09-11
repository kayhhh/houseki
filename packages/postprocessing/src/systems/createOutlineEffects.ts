import { RenderStore } from "@houseki-engine/render";
import { SceneStruct } from "@houseki-engine/scene";
import { OutlineEffect } from "postprocessing";
import { Entity, Mut, Query, Res, With } from "thyseus";

import { OutlinePass, OutlineTarget } from "../components";
import { OutlineRes } from "../resources";

export function createOutlineEffects(
  sceneStruct: Res<SceneStruct>,
  renderStore: Res<RenderStore>,
  res: Res<Mut<OutlineRes>>,
  outlines: Query<[Entity, OutlinePass]>,
  targets: Query<Entity, With<OutlineTarget>>
) {
  for (const [entity, outline] of outlines) {
    const cameraId = sceneStruct.activeCamera;
    if (cameraId === null) return;

    const camera = renderStore.perspectiveCameras.get(cameraId);
    if (!camera) return;

    const scene = renderStore.scenes.get(entity.id);
    if (!scene) return;

    let effect = res.effect;

    if (!effect || effect.resolution.width !== outline.resolution) {
      if (effect) {
        effect.dispose();
      }

      effect = new OutlineEffect(scene, camera, {
        resolutionX: outline.resolution,
        resolutionY: outline.resolution,
      });
      res.effect = effect;
      res.hasChanged = true;
    }

    effect.mainScene = scene;
    effect.mainCamera = camera;
    effect.edgeStrength = outline.edgeStrength;
    effect.multisampling = outline.multisampling;
    effect.xRay = outline.xray;
    effect.blendMode.opacity.value = outline.opacity;

    effect.visibleEdgeColor.fromArray(outline.visibleEdgeColor);
    effect.hiddenEdgeColor.fromArray(outline.hiddenEdgeColor);

    effect.selection.clear();

    for (const targetEntity of targets) {
      const object = renderStore.nodes.get(targetEntity.id);
      if (!object) continue;

      effect.selection.add(object);

      object.traverse((child) => {
        effect?.selection.add(child);
      });
    }
  }

  // Dispose of the effect if there are no outlines
  if (outlines.length === 0) {
    res.effect?.dispose();
    res.effect = null;
    res.hasChanged = true;
  }
}
