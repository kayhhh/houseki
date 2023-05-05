import { System, system } from "@lastolivegames/becsy";
import { PCFSoftShadowMap, sRGBEncoding, WebGLRenderer } from "three";

import {
  CanvasTarget,
  PerspectiveCameraObject,
  RenderView,
  SceneObject,
} from "./components";

/**
 * Renders RenderViews to CanvasTargets.
 */
@system
export class Renderer extends System {
  private readonly sceneObjects = this.query((q) => q.with(SceneObject));
  private readonly cameraObjects = this.query((q) =>
    q.with(PerspectiveCameraObject)
  );

  private readonly targets = this.query((q) => q.current.with(CanvasTarget));
  private readonly addedOrChangedTargets = this.query(
    (q) => q.addedOrChanged.with(CanvasTarget).trackWrites
  );
  private readonly removedTargets = this.query((q) =>
    q.removed.with(CanvasTarget)
  );

  private readonly views = this.query((q) => q.current.with(RenderView));

  private renderer = new WebGLRenderer();

  override execute() {
    // Create renderer
    for (const entity of this.addedOrChangedTargets.addedOrChanged) {
      // Dispose of old renderer
      this.renderer.dispose();

      // Get canvas
      if (!entity.has(CanvasTarget)) continue;
      const canvas = entity.read(CanvasTarget).canvas;

      // Create new renderer
      this.renderer = new WebGLRenderer({
        antialias: true,
        canvas,
        powerPreference: "high-performance",
      });
      this.renderer.outputEncoding = sRGBEncoding;
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = PCFSoftShadowMap;
      this.renderer.setPixelRatio(window.devicePixelRatio);
    }

    // Dispose renderer
    for (const _ of this.removedTargets.removed) {
      this.renderer.dispose();
    }

    const canvas = this.targets.current[0]?.read(CanvasTarget).canvas;
    if (!canvas) return;

    // Update renderer size
    this.renderer.setSize(canvas.width, canvas.height, false);

    // Render each view
    for (const entity of this.views.current) {
      // Get camera
      const camera = entity.read(RenderView).camera;
      if (!camera.has(PerspectiveCameraObject)) continue;
      const cameraObject = camera.read(PerspectiveCameraObject).object;

      // Update camera aspect ratio
      cameraObject.aspect = canvas.width / canvas.height;
      cameraObject.updateProjectionMatrix();

      // Get scene
      const scene = entity.read(RenderView).scene;
      if (!scene.has(SceneObject)) continue;
      const sceneObject = scene.read(SceneObject).object;

      // Render
      this.renderer.render(sceneObject, cameraObject);
    }
  }
}
