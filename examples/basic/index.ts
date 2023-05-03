import { System, system } from "@lastolivegames/becsy";
import {
  Engine,
  Node,
  PerspectiveCamera,
  Renderer,
  RenderView,
  Scene,
} from "@lattice-engine/core";

/**
 * Define a system to create a scene
 * The `@system` decorator will automatically register the system with the engine
 * We also use the `@system` decorator to define the order of systems
 * Here we tell the system to run after the Renderer system, which is at the end of the execution loop
 */
@system((s) => s.after(Renderer))
class BasicSystem extends System {
  /**
   * Here we define queries to get entities with specific components
   * These mark the system as needing `write` access to the components
   */
  private readonly cameras = this.query((q) => q.with(PerspectiveCamera).write);
  private readonly nodes = this.query((q) => q.with(Node).write);
  private readonly scenes = this.query((q) => q.with(Scene).write);
  private readonly views = this.query((q) => q.with(RenderView).write);

  /**
   * The `initialize` method is called once when the system is added to the engine
   */
  override initialize() {
    const camera = this.createEntity(PerspectiveCamera);
    const root = this.createEntity(Node);
    const scene = this.createEntity(Scene, { root });
    this.createEntity(RenderView, { camera, scene });
  }
}

// Create canvas
const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

// Create engine
const engine = await Engine.create(canvas);

// Start the render loop
engine.start();
