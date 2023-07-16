import { Scene } from "@lattice-engine/scene";
import { Scene as ThreeScene, Texture } from "three";
import { Entity, Query, Res, With } from "thyseus";

import { RenderStore } from "../resources";

/**
 * Creates and updates scene objects.
 */
export function createScenes(
  renderStore: Res<RenderStore>,
  entities: Query<Entity, With<Scene>>
) {
  const ids: bigint[] = [];

  for (const entity of entities) {
    ids.push(entity.id);

    let object = renderStore.scenes.get(entity.id);

    // Create new objects
    if (!object) {
      object = new ThreeScene();
      renderStore.scenes.set(entity.id, object);
    }
  }

  // Remove objects that no longer exist
  for (const [id] of renderStore.scenes) {
    if (!ids.includes(id)) {
      const object = renderStore.scenes.get(id);

      if (object) {
        if (object.environment) {
          object.environment.dispose();
          object.environment = null;
        }

        if (object.background instanceof Texture) {
          object.background.dispose();
          object.background = null;
        }
      }

      renderStore.scenes.delete(id);
    }
  }
}
