import { applyCommands, run, World } from "thyseus";

import { LatticeSchedules } from "./schedules";

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

  #scheduleQueue: symbol[] = [];

  /**
   * Creates a new WorldBuilder.
   */
  static createWorld() {
    const world = World.new().addSystems(run(applyCommands).last());
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
    this.#startPromise = this.world.runSchedule(LatticeSchedules.Startup);
    await this.#startPromise;

    // Initialize the last fixed time
    this.#lastFixedTime = performance.now();

    // Main loop
    this.#animationFrame = requestAnimationFrame(this.#loop.bind(this));
  }

  async #loop() {
    const time = performance.now();

    // Run the main update loop
    await this.#runSchedule(LatticeSchedules.Update);

    // Run the fixed update loop
    const fixedStep = 1000 / FIXED_HZ;
    this.#leftoverFixedTime += time - this.#lastFixedTime;

    if (this.#leftoverFixedTime >= fixedStep) {
      await this.#runSchedule(LatticeSchedules.FixedUpdate);
      this.#leftoverFixedTime -= fixedStep;
      this.#lastFixedTime = time;
    }

    // Run queued schedules
    while (this.#scheduleQueue.length > 0) {
      const schedule = this.#scheduleQueue.shift();
      if (schedule) await this.#runSchedule(schedule);
    }

    // Schedule the next frame
    this.#animationFrame = requestAnimationFrame(this.#loop.bind(this));
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
    await this.#runSchedule(LatticeSchedules.Destroy);
  }

  /**
   * Runs a schedule, if it exists.
   */
  async #runSchedule(schedule: symbol) {
    if (this.world.schedules[schedule]) await this.world.runSchedule(schedule);
  }

  queueSchedule(schedule: symbol) {
    this.#scheduleQueue.push(schedule);
  }
}
