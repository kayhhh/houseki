import { CoreStore } from "@lattice-engine/core";
import { PCFSoftShadowMap, sRGBEncoding, WebGLRenderer } from "three";
import { ResourceDescriptor } from "thyseus";

import { RenderStore } from "./RenderStore";

/**
 * Renders the scene to the canvas.
 */
export function canvasRenderer(coreStore: CoreStore, renderStore: RenderStore) {
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

  const cameraId = coreStore.activeCamera;
  if (cameraId === null) return;

  const camera = renderStore.perspectiveCameras.get(cameraId);
  if (!camera) return;

  const sceneId = coreStore.activeScene;
  if (sceneId === null) return;

  const scene = renderStore.scenes.get(sceneId);
  if (!scene) return;

  renderer.setSize(canvas.width, canvas.height, false);
  renderer.render(scene, camera);
}

canvasRenderer.parameters = [
  ResourceDescriptor(CoreStore),
  ResourceDescriptor(RenderStore),
];
