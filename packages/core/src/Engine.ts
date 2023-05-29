import { CoreSchedule, World } from "thyseus";

import { LatticeSchedules } from "./constants";

const FIXED_HZ = 60;

/**
 * Stores the ECS world and manages the game loop.
 */
export class Engine {
  readonly world: World;

  #lastFixedTime = 0;
  #leftoverFixedTime = 0;

  #animationFrame: number | null = null;
  #startPromise: Promise<void> | null = null;

  /**
   * Creates a new WorldBuilder.
   */
  static createWorld() {
    const world = World.new();
    return world;
  }

  constructor(world: World) {
    this.world = world;
  }

  /**
   * Starts the engine.
   */
  async start() {
    const stopPromise = this.stop();
    if (stopPromise) await stopPromise;

    // Startup
    this.#startPromise = this.world.runSchedule(CoreSchedule.Startup);
    await this.#startPromise;

    // Initialize the last fixed time
    this.#lastFixedTime = performance.now();

    // Main loop
    this.#animationFrame = requestAnimationFrame(this.#mainLoop.bind(this));
  }

  async #mainLoop() {
    const time = performance.now();

    // Run the main update loop
    await this.world.runSchedule(CoreSchedule.Main);

    // Run the fixed update loop
    if (this.world.schedules[CoreSchedule.FixedUpdate]) {
      let fixedDelta = time - this.#lastFixedTime + this.#leftoverFixedTime;
      const fixedStep = 1000 / FIXED_HZ;

      while (fixedDelta >= fixedStep) {
        await this.world.runSchedule(CoreSchedule.FixedUpdate);
        fixedDelta -= fixedStep;
        this.#lastFixedTime += fixedStep;
      }

      this.#leftoverFixedTime = fixedDelta;
    }

    // Schedule the next frame
    this.#animationFrame = requestAnimationFrame(this.#mainLoop.bind(this));
  }

  /**
   * Stops the engine.
   */
  stop() {
    if (this.#startPromise !== null) {
      return this.#startPromise.then(() => {
        this.#startPromise = null;
        this.stop();
      });
    }

    if (this.#animationFrame !== null) {
      cancelAnimationFrame(this.#animationFrame);
      this.#animationFrame = null;
    }
  }

  /**
   * Destroys the engine.
   */
  async destroy() {
    await this.stop();
    await this.world.runSchedule(LatticeSchedules.Destroy);
  }
}
