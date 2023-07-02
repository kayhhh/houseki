import { Scene } from "@lattice-engine/scene";
import {
  CanvasTexture,
  EquirectangularReflectionMapping,
  Scene as ThreeScene,
  SRGBColorSpace,
  Texture,
} from "three";
import { Entity, Query, Res } from "thyseus";

import { RenderStore } from "../resources";

/**
 * Creates and updates scene objects.
 */
export function createScenes(
  renderStore: Res<RenderStore>,
  entities: Query<[Entity, Scene]>
) {
  const ids: bigint[] = [];

  for (const [entity, scene] of entities) {
    ids.push(entity.id);

    let object = renderStore.scenes.get(entity.id);

    // Create new objects
    if (!object) {
      object = new ThreeScene();
      renderStore.scenes.set(entity.id, object);
    }

    loadSkybox(object, scene.skyboxId, renderStore);
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

function loadSkybox(
  scene: ThreeScene,
  imageId: bigint,
  renderStore: RenderStore
) {
  const bitmap = renderStore.images.get(imageId);

  if (scene.background instanceof Texture) {
    if (scene.background.image === bitmap) return;
    scene.background.dispose();
  }

  if (scene.environment) scene.environment.dispose();

  if (!bitmap) {
    scene.environment = null;
    scene.background = null;
    return;
  }

  const texture = new CanvasTexture(bitmap);
  texture.mapping = EquirectangularReflectionMapping;
  texture.colorSpace = SRGBColorSpace;

  // Set skybox
  scene.environment = texture;
  scene.background = texture;
}
