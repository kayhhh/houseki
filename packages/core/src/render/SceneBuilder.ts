import { System, system } from "@lastolivegames/becsy";
import { Scene as ThreeScene } from "three";

import { NodeObject, Scene, SceneObject } from "../components";
import { Renderer } from "./Renderer";

/**
 * Converts Scene components to Three.js objects.
 */
@system((s) => s.before(Renderer).beforeReadersOf(SceneObject))
export class SceneBuilder extends System {
  private readonly objects = this.query((q) => q.with(SceneObject).write);
  private readonly nodeObjects = this.query((q) => q.with(NodeObject).read);

  private readonly addedScenes = this.query((q) => q.added.with(Scene));
  private readonly addedOrChangedScenes = this.query(
    (q) => q.addedOrChanged.with(Scene).trackWrites
  );
  private readonly removedScenes = this.query((q) => q.removed.with(Scene));

  override execute() {
    // Create objects
    for (const entity of this.addedScenes.added) {
      const object = new ThreeScene();
      entity.add(SceneObject, { object });
    }

    // Sync objects
    for (const entity of this.addedOrChangedScenes.addedOrChanged) {
      // Get root object
      const root = entity.read(Scene).root;
      if (!root.has(NodeObject)) continue;
      const rootObject = root.read(NodeObject).object;

      // Get scene object
      const object = entity.read(SceneObject).object;

      // Add root object to scene
      object.add(rootObject);
    }

    // Remove objects
    for (const entity of this.removedScenes.removed) {
      const object = entity.read(SceneObject).object;
      object.clear();

      entity.remove(SceneObject);
    }
  }
}
