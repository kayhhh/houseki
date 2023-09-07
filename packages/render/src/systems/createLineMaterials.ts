import { LineMaterial } from "@reddo/scene";
import { LineBasicMaterial } from "three";
import { Entity, Query, Res } from "thyseus";

import { RenderStore } from "../resources";
import { disposeMaterial } from "../utils/dispose";

export function createLineMaterials(
  renderStore: Res<RenderStore>,
  entities: Query<[Entity, LineMaterial]>
) {
  const ids: bigint[] = [];

  for (const [entity, material] of entities) {
    ids.push(entity.id);

    let object = renderStore.lineMaterials.get(entity.id);

    // Create new objects
    if (!object) {
      object = new LineBasicMaterial();
      renderStore.lineMaterials.set(entity.id, object);
    }

    // Sync object properties
    object.color.fromArray(material.color);
    object.vertexColors = material.vertexColors;
  }

  // Dispose unused objects
  for (const [id, object] of renderStore.lineMaterials) {
    if (!ids.includes(id)) {
      disposeMaterial(object);
      renderStore.lineMaterials.delete(id);
    }
  }
}
