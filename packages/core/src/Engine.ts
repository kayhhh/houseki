import { World } from "@lastolivegames/becsy";

/**
 * Should only have one Engine in your application, as having
 * multiple Becsy worlds can cause issues.
 */
export class Engine {
  readonly world: World;

  constructor(world: World) {
    this.world = world;
  }

  static async create() {
    const world = await World.create();
    const engine = new Engine(world);
    return engine;
  }
}
