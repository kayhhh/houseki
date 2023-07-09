import { AmbientLight } from "@lattice-engine/scene";
import { AmbientLight as ThreeAmbientLight } from "three";
import { Entity, Query, Res } from "thyseus";

import { RenderStore } from "../resources";

export function createAmbientLights(
  renderStore: Res<RenderStore>,
  entities: Query<[Entity, AmbientLight]>,
) {
  const ids: bigint[] = [];

  for (const [entity, light] of entities) {
    ids.push(entity.id);

    let object = renderStore.ambientLights.get(entity.id);

    // Create new objects
    if (!object) {
      object = new ThreeAmbientLight();
      renderStore.ambientLights.set(entity.id, object);
    }

    // Sync object properties
    object.color.fromArray(light.color);
    object.intensity = light.intensity;

    const node = renderStore.nodes.get(entity.id);
    if (node) node.add(object);
  }

  // Remove objects that no longer exist
  for (const [id] of renderStore.ambientLights) {
    if (!ids.includes(id)) {
      const object = renderStore.ambientLights.get(id);
      object?.removeFromParent();
      renderStore.ambientLights.delete(id);
    }
  }
}
