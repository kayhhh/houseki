import { RenderStore } from "@lattice-engine/render";
import { SceneStruct } from "@lattice-engine/scene";
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
      if (effect) effect.dispose();

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

    const visibleEdgeColor = [
      outline.visibleEdgeColor[0],
      outline.visibleEdgeColor[1],
      outline.visibleEdgeColor[2],
    ] as [number, number, number];
    effect.visibleEdgeColor.fromArray(visibleEdgeColor);

    const hiddenEdgeColor = [
      outline.hiddenEdgeColor[0],
      outline.hiddenEdgeColor[1],
      outline.hiddenEdgeColor[2],
    ] as [number, number, number];
    effect.hiddenEdgeColor.fromArray(hiddenEdgeColor);

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
    res.hasChanged;
  }
}
