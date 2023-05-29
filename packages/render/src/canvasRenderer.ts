import { CoreStore, CoreStruct } from "@lattice-engine/core";
import { PCFSoftShadowMap, sRGBEncoding, WebGLRenderer } from "three";
import { Mut, Res } from "thyseus";

import { RenderStats, RenderStore } from "./resources";

/**
 * Renders the scene to the canvas.
 */
export function canvasRenderer(
  coreStore: Res<CoreStore>,
  coreStruct: Res<CoreStruct>,
  renderStore: Res<Mut<RenderStore>>,
  stats: Res<Mut<RenderStats>>
) {
  let renderer = renderStore.renderer;
  const canvas = coreStore.canvas;

  // Create a new renderer if the canvas has changed
  if (renderer.domElement !== canvas) {
    // Dispose old renderer
    renderer.dispose();

    // Create new renderer
    renderer = new WebGLRenderer({
      antialias: true,
      canvas: canvas ?? undefined,
      powerPreference: "high-performance",
    });
    renderer.outputEncoding = sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;

    renderStore.renderer = renderer;
  }

  if (!canvas) return;

  const cameraId = coreStruct.activeCamera;
  if (cameraId === null) return;

  const camera = renderStore.perspectiveCameras.get(cameraId);
  if (!camera) return;

  const sceneId = coreStruct.activeScene;
  if (sceneId === null) return;

  const scene = renderStore.scenes.get(sceneId);
  if (!scene) return;

  renderer.setSize(canvas.width, canvas.height, false);
  renderer.render(scene, camera);

  stats.frame = renderer.info.render.frame;
  stats.calls = renderer.info.render.calls;
  stats.lines = renderer.info.render.lines;
  stats.points = renderer.info.render.points;
  stats.triangles = renderer.info.render.triangles;
  stats.geometries = renderer.info.memory.geometries;
  stats.textures = renderer.info.memory.textures;
  stats.shaders = renderer.info.programs?.length ?? 0;
}
