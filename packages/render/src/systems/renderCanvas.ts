import { CoreStore } from "@lattice-engine/core";
import { SceneStruct } from "@lattice-engine/scene";
import {
  EffectComposer,
  EffectPass,
  RenderPass,
  SMAAEffect,
} from "postprocessing";
import { PCFSoftShadowMap, sRGBEncoding, WebGLRenderer } from "three";
import { Mut, Res, SystemRes } from "thyseus";

import { RenderStats, RenderStore } from "../resources";

class LocalStore {
  readonly renderPass = new RenderPass();
  readonly effectPass = new EffectPass(undefined, new SMAAEffect());
}

/**
 * Renders the scene to the canvas.
 */
export function renderCanvas(
  coreStore: Res<CoreStore>,
  sceneStruct: Res<SceneStruct>,
  renderStore: Res<Mut<RenderStore>>,
  stats: Res<Mut<RenderStats>>,
  localStore: SystemRes<LocalStore>
) {
  let renderer = renderStore.renderer;
  const canvas = coreStore.canvas;

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
    renderer.outputEncoding = sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    renderer.info.autoReset = false;

    const composer = new EffectComposer(renderer);
    composer.addPass(localStore.renderPass);
    composer.addPass(localStore.effectPass);

    renderStore.renderer = renderer;
    renderStore.composer = composer;
  }

  if (!canvas) return;

  const cameraId = sceneStruct.activeCamera;
  if (cameraId === null) return;

  const camera = renderStore.perspectiveCameras.get(cameraId);
  if (!camera) return;

  const sceneId = sceneStruct.activeScene;
  if (sceneId === null) return;

  const scene = renderStore.scenes.get(sceneId);
  if (!scene) return;

  localStore.renderPass.mainScene = scene;
  localStore.renderPass.mainCamera = camera;
  localStore.effectPass.mainCamera = camera;

  renderStore.composer.setSize(canvas.width, canvas.height);
  renderStore.composer.render();

  stats.frame = renderer.info.render.frame;
  stats.calls = renderer.info.render.calls;
  stats.lines = renderer.info.render.lines;
  stats.points = renderer.info.render.points;
  stats.triangles = renderer.info.render.triangles;
  stats.geometries = renderer.info.memory.geometries;
  stats.textures = renderer.info.memory.textures;
  stats.shaders = renderer.info.programs?.length ?? 0;

  renderer.info.reset();
}
