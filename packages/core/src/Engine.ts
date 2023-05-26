import { CoreSchedule, World } from "thyseus";

import { LatticeSchedules } from "./constants";
import { corePlugin } from "./plugin";

/**
 * Stores the ECS world and manages the game loop.
 */
export class Engine {
  readonly world: World;

  #animationFrame = 0;
  #fixedInterval: number | null = null;

  /**
   * Creates a new WorldBuilder, with the core plugin already applied.
   */
  static createWorld() {
    const world = World.new();
    corePlugin(world);
    return world;
  }

  constructor(world: World) {
    this.world = world;
  }

  /**
   * Starts the engine.
   */
  start() {
    this.stop();

    // Startup
    this.world.runSchedule(CoreSchedule.Startup);

    // Main loop
    this.#animationFrame = requestAnimationFrame(this.#mainLoop.bind(this));

    // Fixed loop
    if (this.world.schedules[CoreSchedule.FixedUpdate]) {
      this.#fixedInterval = setInterval(this.#fixedLoop.bind(this), 1000 / 60);
    }
  }

  async #mainLoop() {
    await this.world.runSchedule(CoreSchedule.Main);
    this.#animationFrame = requestAnimationFrame(this.#mainLoop.bind(this));
  }

  async #fixedLoop() {
    await this.world.runSchedule(CoreSchedule.FixedUpdate);
  }

  /**
   * Stops the engine.
   */
  stop() {
    cancelAnimationFrame(this.#animationFrame);

    if (this.#fixedInterval !== null) {
      clearInterval(this.#fixedInterval);
      this.#fixedInterval = null;
    }
  }

  /**
   * Destroys the engine.
   */
  destroy() {
    this.stop();
    this.world.runSchedule(LatticeSchedules.Destroy);
  }
}
