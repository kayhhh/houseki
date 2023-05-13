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
import {
  Entity,
  Query,
  QueryDescriptor,
  Res,
  ResourceDescriptor,
  With,
  WithDescriptor,
} from "thyseus";

import { RenderStore } from "../RenderStore";

export function sceneBuilder(
  store: Res<RenderStore>,
  entities: Query<Entity, With<IsScene>>
) {
  const ids: bigint[] = [];

  for (const { id } of entities) {
    ids.push(id);

    let object = store.scenes.get(id);

    // Create new objects
    if (!object) {
      object = new ThreeScene();

      const pointLight = new PointLight(0xffffff, 0.5);
      pointLight.castShadow = true;

      object.add(new AmbientLight(0xffffff, 0.5));
      object.add(pointLight);

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

sceneBuilder.parameters = [
  ResourceDescriptor(RenderStore),
  QueryDescriptor(Entity, WithDescriptor(IsScene)),
];

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
