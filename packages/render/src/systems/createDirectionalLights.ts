import { DirectionalLight } from "@lattice-engine/scene";
import { DirectionalLight as ThreeDirectionalLight } from "three";
import { Entity, Query, Res } from "thyseus";

import { RenderStore } from "../resources";

export function createDirectionalLights(
  renderStore: Res<RenderStore>,
  entities: Query<[Entity, DirectionalLight]>
) {
  const ids: bigint[] = [];

  for (const [entity, light] of entities) {
    ids.push(entity.id);

    let object = renderStore.directionalLights.get(entity.id);

    // Create new objects
    if (!object) {
      object = new ThreeDirectionalLight();
      renderStore.directionalLights.set(entity.id, object);
    }

    // Sync object properties
    object.color.fromArray(light.color);
    object.intensity = light.intensity;

    const node = renderStore.nodes.get(entity.id);
    if (node) node.add(object);
  }

  // Remove objects that no longer exist
  for (const [id] of renderStore.directionalLights) {
    if (!ids.includes(id)) {
      const object = renderStore.directionalLights.get(id);
      object?.removeFromParent();
      renderStore.directionalLights.delete(id);
    }
  }
}
