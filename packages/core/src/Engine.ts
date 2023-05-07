import { World } from "thyseus";

import { corePlugin } from "./plugin";

/**
 * Stores the ECS world and manages the game loop.
 */
export class Engine {
  readonly world: World;

  #animationFrame = 0;

  /**
   * Creates a new WorldBuilder, with all core components and systems registered.
   */
  static createWorld() {
    return World.new().addPlugin(corePlugin);
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
    this.stop();
    await this.update();
  }

  /**
   * Updates the world.
   */
  async update() {
    await this.world.update();
    this.#animationFrame = requestAnimationFrame(this.start.bind(this));
  }

  /**
   * Stops the game loop.
   */
  stop() {
    cancelAnimationFrame(this.#animationFrame);
  }
}
