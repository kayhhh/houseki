import { System, system } from "@lastolivegames/becsy";
import { resourceStore } from "@lattice-engine/core";
import { Geometry } from "@lattice-engine/core";
import {
  Engine,
  Mesh,
  Node,
  PerspectiveCamera,
  Scene,
} from "@lattice-engine/core";
import { CanvasTarget, Renderer, RenderView } from "@lattice-engine/render";
import { BoxGeometry, BufferAttribute } from "three";

/**
 * Define a system to create a scene
 * The `@system` decorator will automatically register the system with the engine
 * We also use the `@system` decorator to define the order of systems
 * Here we tell the system to run after the Renderer system, which is at the end of the execution loop
 */
@system((s) => s.after(Renderer))
class CreateScene extends System {
  /**
   * Here we define queries to get entities with specific components
   * These mark the system as needing `write` access to the components
   */
  readonly #cameras = this.query((q) => q.with(PerspectiveCamera).write);
  readonly #nodes = this.query((q) => q.with(Node).write);
  readonly #scenes = this.query((q) => q.with(Scene).write);
  readonly #views = this.query((q) => q.with(RenderView).write);
  readonly #meshes = this.query((q) => q.with(Mesh).write);
  readonly #geometries = this.query((q) => q.with(Geometry).write);

  /**
   * The `initialize` method is called once when the system is added to the engine
   */
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
      position: [1, -1, -5],
      rotation: [0, 0, 0, 1],
      scale: [1, 1, 1],
    });

    const scene = this.createEntity();
    scene.add(Scene, { root });

    this.createEntity(RenderView, { camera, scene });

    // Create a cube
    // Use Three.js to generate the geometry data
    const box = new BoxGeometry();

    const positionAttribute = box.getAttribute("position") as BufferAttribute;
    const normalAttribute = box.getAttribute("normal") as BufferAttribute;
    const uvAttribute = box.getAttribute("uv") as BufferAttribute;
    const indexAttribute = box.index as BufferAttribute;

    const positionArray = positionAttribute.array as Float32Array;
    const normalArray = normalAttribute.array as Float32Array;
    const uvArray = uvAttribute.array as Float32Array;
    const indexArray = indexAttribute.array as Uint16Array;

    // Store the geometry data in the resource store
    const positionId = resourceStore.store(positionArray);
    const normalId = resourceStore.store(normalArray);
    const uvId = resourceStore.store(uvArray);
    const indexId = resourceStore.store(indexArray);

    // Add mesh to the root node
    root.add(Mesh);
    root.add(Geometry, { indexId, normalId, positionId, uvId });
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
