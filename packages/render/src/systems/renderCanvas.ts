import { CoreStore } from "@houseki-engine/core";
import { RenderView, SceneView } from "@houseki-engine/scene";
import {
  EffectComposer,
  EffectPass,
  RenderPass,
  SMAAEffect,
  SMAAPreset,
} from "postprocessing";
import { PCFSoftShadowMap, WebGLRenderer } from "three";
import { Mut, Query, Res } from "thyseus";

import { RenderStats, RenderStore } from "../resources";

/**
 * Renders the scene to the canvas.
 */
export function renderCanvas(
  coreStore: Res<CoreStore>,
  renderStore: Res<Mut<RenderStore>>,
  stats: Res<Mut<RenderStats>>,
  views: Query<[RenderView, SceneView]>
) {
  const canvas = coreStore.canvas;
  if (!canvas) return;

  let renderer = renderStore.renderer;

  for (const [renderView, sceneView] of views) {
    const camera = renderStore.perspectiveCameras.get(renderView.cameraId);
    if (!camera) return;

    const scene = renderStore.scenes.get(sceneView.active);
    if (!scene) return;

    // Create a new renderer if the canvas has changed
    if (renderer.domElement !== canvas) {
      // Dispose old renderer
      renderer.dispose();
      renderStore.composer.dispose();

      // Create new renderer
      renderer = new WebGLRenderer({
        canvas: canvas ?? undefined,
        depth: false,
        powerPreference: "high-performance",
        stencil: false,
      });
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = PCFSoftShadowMap;
      renderer.info.autoReset = false;

      const composer = new EffectComposer(renderer, {
        depthBuffer: true,
        stencilBuffer: true,
      });

      const renderPass = new RenderPass(scene, camera);
      renderPass.clearPass.enabled = false;

      const effectPass = new EffectPass(
        camera,
        new SMAAEffect({ preset: SMAAPreset.HIGH })
      );

      composer.addPass(renderPass);
      composer.addPass(effectPass);

      renderStore.renderer = renderer;
      renderStore.composer = composer;
    }

    renderStore.composer.setSize(canvas.width, canvas.height);
    renderStore.composer.setMainCamera(camera);
    renderStore.composer.setMainScene(scene);

    renderStore.composer.render();
  }

  stats.frame += 1;
  stats.calls = renderer.info.render.calls;
  stats.lines = renderer.info.render.lines;
  stats.points = renderer.info.render.points;
  stats.triangles = renderer.info.render.triangles;
  stats.geometries = renderer.info.memory.geometries;
  stats.textures = renderer.info.memory.textures;
  stats.shaders = renderer.info.programs?.length ?? 0;

  renderer.info.reset();
}
