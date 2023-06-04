import { Scene } from "@lattice-engine/scene";
import {
  AmbientLight,
  CanvasTexture,
  DirectionalLight,
  EquirectangularReflectionMapping,
  Scene as ThreeScene,
  sRGBEncoding,
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

      // TODO: Move lights into ECS
      const directionalLight = new DirectionalLight(0xffffff, 0.75);
      directionalLight.position.multiplyScalar(30);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.set(2048, 2048);
      directionalLight.shadow.camera.near = 0.1;
      directionalLight.shadow.camera.far = 100;
      directionalLight.shadow.camera.left = -8;
      directionalLight.shadow.camera.right = 8;
      directionalLight.shadow.camera.top = 8;
      directionalLight.shadow.camera.bottom = -8;
      directionalLight.shadow.bias = -0.0001;

      object.add(new AmbientLight(0xffffff, 0.25));
      object.add(directionalLight);

      renderStore.scenes.set(entity.id, object);
    }

    loadSkybox(object, scene.skyboxId, renderStore);
  }

  // Remove objects that no longer exist
  for (const [id] of renderStore.scenes) {
    if (!ids.includes(id)) {
      const object = renderStore.scenes.get(id);
      object?.environment?.dispose();

      if (object?.background instanceof Texture) {
        object?.background?.dispose();
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
  texture.encoding = sRGBEncoding;

  // Set skybox
  scene.environment = texture;
  scene.background = texture;
}
