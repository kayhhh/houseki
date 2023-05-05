// Import all core components and systems, so they are registered by the engine
import "./components";
import "./resource";

import { World } from "@lastolivegames/becsy";

/**
 * Stores the ECS world and manages the game loop.
 */
export class Engine {
  readonly world: World;

  #animationFrame = 0;

  /**
   * Creates a new Engine instance.
   */
  static async create() {
    const world = await World.create();
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
