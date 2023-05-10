import { ResourceDescriptor } from "thyseus";

import { RenderStore } from "./RenderStore";

/**
 * Renders the scene to the canvas.
 */
export function canvasRenderer(store: RenderStore) {
  const renderer = store.renderer;
  if (!renderer) return;

  const cameraId = store.activeCamera;
  if (cameraId === null) return;

  const camera = store.perspectiveCameras.get(cameraId);
  if (!camera) return;

  const sceneId = store.activeScene;
  if (sceneId === null) return;

  const scene = store.scenes.get(sceneId);
  if (!scene) return;

  const canvas = renderer.domElement;
  renderer.setSize(canvas.width, canvas.height, false);

  renderer.render(scene, camera);
}

canvasRenderer.parameters = [ResourceDescriptor(RenderStore)];
