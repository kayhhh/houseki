import { System, system } from "@lastolivegames/becsy";
import { PCFSoftShadowMap, sRGBEncoding, WebGLRenderer } from "three";

import { Canvas, Scene } from "../components";

/**
 * The Renderer is responsible for rendering to the canvas.
 */
@system
export class Renderer extends System {
  private readonly canvases = this.query((q) => q.addedOrChanged.with(Canvas));
  private renderer = new WebGLRenderer();

  private readonly scenes = this.query((q) => q.addedOrChanged.with(Scene));

  override execute(): void {
    const canvas = this.canvases.current[0];
    if (!canvas) return;

    // Update renderer on canvas change
    this.canvases.addedOrChanged.forEach((entity) => {
      const node = entity.read(Canvas).node;

      // Dispose of old renderer
      this.renderer.dispose();

      // Create new renderer
      this.renderer = new WebGLRenderer({
        antialias: true,
        canvas: node,
        powerPreference: "high-performance",
      });
      this.renderer.outputEncoding = sRGBEncoding;
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = PCFSoftShadowMap;
      this.renderer.setPixelRatio(window.devicePixelRatio);
    });

    // Update renderer size
    const node = canvas.read(Canvas).node;
    this.renderer.setSize(node.clientWidth, node.clientHeight, false);
  }
}
