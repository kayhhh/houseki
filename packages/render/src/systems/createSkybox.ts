import { Scene, SceneStruct, Skybox } from "@reddo/scene";
import {
  BackSide,
  CanvasTexture,
  EquirectangularReflectionMapping,
  Mesh,
  MeshBasicMaterial,
  SphereGeometry,
  SRGBColorSpace,
} from "three";
import { Entity, Query, Res, SystemRes, With } from "thyseus";

import { RenderStore } from "../resources";
import { disposeMaterial } from "../utils/dispose";

class LocalRes {
  /**
   * Entity ID -> Skybox
   */
  readonly objects = new Map<bigint, Mesh>();
}

export function createSkybox(
  localRes: SystemRes<LocalRes>,
  renderStore: Res<RenderStore>,
  sceneStruct: Res<SceneStruct>,
  scenes: Query<[Entity, Skybox], With<Scene>>
) {
  const ids: bigint[] = [];

  for (const [entity, skybox] of scenes) {
    ids.push(entity.id);

    const sceneObj = renderStore.scenes.get(entity.id);
    if (!sceneObj) continue;

    let object = localRes.objects.get(entity.id);

    // Create new objects
    if (!object) {
      const geometry = new SphereGeometry();

      const material = new MeshBasicMaterial();
      material.side = BackSide;

      object = new Mesh(geometry, material);
      object.scale.setScalar(500);

      localRes.objects.set(entity.id, object);

      sceneObj.add(object);
    }

    // Move box to camera position
    const camera = renderStore.perspectiveCameras.get(sceneStruct.activeCamera);
    if (camera) {
      object.position.copy(camera.position);
      object.scale.setScalar(camera.far * 0.95);
    }

    // Set texture
    const bitmap = renderStore.images.get(skybox.imageId);

    if (sceneObj.environment) {
      if (sceneObj.environment.image === bitmap) continue;
      sceneObj.environment.dispose();
    }

    if (!bitmap) {
      sceneObj.environment = null;
      continue;
    }

    const texture = new CanvasTexture(bitmap);
    texture.mapping = EquirectangularReflectionMapping;
    texture.colorSpace = SRGBColorSpace;

    sceneObj.environment = texture;

    if (object.material instanceof MeshBasicMaterial) {
      object.material.map = texture;
      object.material.needsUpdate = true;
    }
  }

  // Remove objects that no longer exist
  for (const [id] of localRes.objects) {
    if (!ids.includes(id)) {
      const object = localRes.objects.get(id);

      if (object) {
        object.removeFromParent();
        disposeMaterial(object.material);
      }

      localRes.objects.delete(id);
    }
  }
}
