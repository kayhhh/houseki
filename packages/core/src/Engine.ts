import { World } from "thyseus";

import { HousekiSchedules } from "./schedules";

/**
 * Stores the ECS world and manages the game loop.
 */
export class Engine {
  readonly world: World;

  #animationFrame: number | null = null;
  #startPromise: Promise<void> | null = null;

  #scheduleQueue: symbol[] = [];

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
    if (stopPromise) {
      await stopPromise;
    }

    this.#startPromise = this.world.runSchedule(HousekiSchedules.Startup);

    await this.#startPromise;

    this.#animationFrame = requestAnimationFrame(this.#loop.bind(this));
  }

  async #loop() {
    await this.#runSchedule(HousekiSchedules.PreLoop);

    await this.#runSchedule(HousekiSchedules.RunFixedUpdate);
    await this.#runSchedule(HousekiSchedules.RunMainUpdate);

    while (this.#scheduleQueue.length > 0) {
      const schedule = this.#scheduleQueue.shift();
      if (schedule) {
        await this.#runSchedule(schedule);
      }
    }

    await this.#runSchedule(HousekiSchedules.Render);
    await this.#runSchedule(HousekiSchedules.ApplyCommands);

    await this.#runSchedule(HousekiSchedules.PostLoop);

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
    await this.#runSchedule(HousekiSchedules.Destroy);
    await this.#runSchedule(HousekiSchedules.Update);
    await this.#runSchedule(HousekiSchedules.FixedUpdate);
  }

  /**
   * Runs a schedule, if it exists.
   */
  async #runSchedule(schedule: symbol) {
    if (this.world.schedules[schedule]) {
      await this.world.runSchedule(schedule);
    }
  }

  queueSchedule(schedule: symbol) {
    this.#scheduleQueue.push(schedule);
  }
}
