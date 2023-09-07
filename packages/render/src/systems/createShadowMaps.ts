import { ShadowMap } from "@reddo/scene";
import { Entity, Query, Res } from "thyseus";

import { RenderStore } from "../resources";

export function createShadowMaps(
  renderStore: Res<RenderStore>,
  entities: Query<[Entity, ShadowMap]>
) {
  const ids: bigint[] = [];

  for (const [entity, shadowMap] of entities) {
    ids.push(entity.id);

    const object = renderStore.directionalLights.get(entity.id);
    if (!object) continue;

    object.castShadow = true;

    object.shadow.mapSize.set(shadowMap.mapSize, shadowMap.mapSize);
    object.shadow.bias = shadowMap.bias;
    object.shadow.camera.near = shadowMap.near;
    object.shadow.camera.far = shadowMap.far;
    object.shadow.camera.left = shadowMap.left;
    object.shadow.camera.right = shadowMap.right;
    object.shadow.camera.top = shadowMap.top;
    object.shadow.camera.bottom = shadowMap.bottom;
  }

  // Stop casting shadows on removal
  for (const [id] of renderStore.directionalLights) {
    if (!ids.includes(id)) {
      const object = renderStore.directionalLights.get(id);
      if (object) object.castShadow = false;
    }
  }
}
