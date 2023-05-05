import "@lattice-engine/render";

import { System, system } from "@lastolivegames/becsy";
import { Engine, Node, PerspectiveCamera, Scene } from "@lattice-engine/core";
import { GLTFLoader, GltfUri } from "@lattice-engine/gltf";
import { CanvasTarget, RenderView } from "@lattice-engine/render";

@system((s) => s.before(GLTFLoader))
class CreateScene extends System {
  readonly #cameras = this.query((q) => q.with(PerspectiveCamera).write);
  readonly #nodes = this.query((q) => q.with(Node).write);
  readonly #scenes = this.query((q) => q.with(Scene).write);
  readonly #views = this.query((q) => q.with(RenderView).write);
  readonly #gltf = this.query((q) => q.with(GltfUri).write);

  override initialize() {
    // Set up the scene
    const camera = this.createEntity();
    camera.add(PerspectiveCamera, {
      far: 1000,
      fov: 75,
      near: 0.1,
    });

    const root = this.createEntity();
    root.add(Node, {
      position: [2, -2, -10],
      rotation: [0, 0, 0, 1],
      scale: [1, 1, 1],
    });

    const scene = this.createEntity();
    scene.add(Scene, { root });

    this.createEntity(RenderView, { camera, scene });

    // Load gltf model
    root.add(GltfUri, { uri: "/cube/Cube.gltf" });
  }
}

// Create engine
const engine = await Engine.create();

// Create canvas
const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Create canvas entity
engine.world.createEntity(CanvasTarget, { canvas });

// Start the game loop
engine.start();
