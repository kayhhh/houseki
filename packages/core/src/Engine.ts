// Import all core components and systems, so they are registered by the engine
import "./components";
import "./resource";

import { World } from "@lastolivegames/becsy";

import { CanvasTarget } from "./components";

/**
 * Stores the ECS world and manages the game loop.
 */
export class Engine {
  readonly world: World;

  #animationFrame = 0;

  /**
   * Creates a new Engine instance.
   */
  static async create(canvas: HTMLCanvasElement) {
    const world = await World.create();

    // Create canvas entity
    world.createEntity(CanvasTarget, { canvas });

    return new Engine(world);
  }

  /**
   * Should not be called directly. Use `Engine.create` instead.
   */
  constructor(world: World) {
    this.world = world;
  }

  /**
   * Starts the game loop.
   */
  async start() {
    await this.world.execute();
    this.#animationFrame = requestAnimationFrame(this.start.bind(this));
  }

  /**
   * Stops the game loop.
   */
  stop() {
    cancelAnimationFrame(this.#animationFrame);
  }
}
