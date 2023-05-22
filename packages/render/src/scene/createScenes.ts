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
import { Entity, Query, Res, With } from "thyseus";

import { RenderStore } from "../RenderStore";

/**
 * Creates and updates scene objects.
 */
export function createScenes(
  store: Res<RenderStore>,
  entities: Query<Entity, With<Scene>>
) {
  const ids: bigint[] = [];

  for (const { id } of entities) {
    ids.push(id);

    let object = store.scenes.get(id);

    // Create new objects
    if (!object) {
      object = new ThreeScene();

      // TODO: Move lights into ECS
      const directionalLight = new DirectionalLight(0xffffff, 0.75);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.set(2048, 2048);
      directionalLight.shadow.camera.near = 0.1;
      directionalLight.shadow.camera.far = 100;
      directionalLight.shadow.camera.left = -12;
      directionalLight.shadow.camera.right = 12;
      directionalLight.shadow.camera.top = 12;
      directionalLight.shadow.camera.bottom = -12;

      object.add(new AmbientLight(0xffffff, 0.25));
      object.add(directionalLight);

      // TODO: Move skybox into ECS
      loadSkybox(object, "/Skybox.jpg");

      store.scenes.set(id, object);
    }
  }

  // Remove objects that no longer exist
  for (const [id] of store.scenes) {
    if (!ids.includes(id)) {
      const object = store.scenes.get(id);
      object?.environment?.dispose();

      if (object?.background instanceof Texture) {
        object?.background?.dispose();
      }

      store.scenes.delete(id);
    }
  }
}

async function loadSkybox(scene: ThreeScene, uri: string | null) {
  // Clean up old skybox
  if (scene.background instanceof Texture) scene.background.dispose();
  if (scene.environment) scene.environment.dispose();

  if (!uri) {
    scene.environment = null;
    scene.background = null;
    return;
  }

  // Load skybox
  const res = await fetch(uri);
  const blob = await res.blob();
  const bitmap = await createImageBitmap(blob, { imageOrientation: "flipY" });

  const texture = new CanvasTexture(bitmap);
  texture.mapping = EquirectangularReflectionMapping;
  texture.encoding = sRGBEncoding;
  texture.needsUpdate = true;

  // Set skybox
  scene.environment = texture;
  scene.background = texture;
}
