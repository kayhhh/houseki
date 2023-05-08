import { IsScene } from "@lattice-engine/core";
import {
  AmbientLight,
  CanvasTexture,
  EquirectangularReflectionMapping,
  PointLight,
  Scene as ThreeScene,
  sRGBEncoding,
  Texture,
} from "three";
import { defineSystem, Entity } from "thyseus";

import { RenderStore } from "../RenderStore";

export const sceneBuilder = defineSystem(
  ({ Res, Query, With }) => [Res(RenderStore), Query(Entity, With(IsScene))],
  (store, scenes) => {
    const ids: bigint[] = [];

    for (const { id } of scenes) {
      ids.push(id);

      let object = store.scenes.get(id);

      // Create new objects
      if (!object) {
        object = new ThreeScene();
        object.add(new AmbientLight(0xffffff, 0.5));
        object.add(new PointLight(0xffffff, 0.5));

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
);

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
