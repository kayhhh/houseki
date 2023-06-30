import { MeshBasicMaterial } from "@lattice-engine/scene";
import { MeshBasicMaterial as ThreeMaterial } from "three";
import { Entity, Query, Res, With } from "thyseus";

import { RenderStore } from "../resources";
import { disposeMaterial } from "../utils/dispose";

export function createMeshBasicMaterials(
  renderStore: Res<RenderStore>,
  entities: Query<Entity, With<MeshBasicMaterial>>
) {
  const ids: bigint[] = [];

  for (const entity of entities) {
    ids.push(entity.id);

    let object = renderStore.basicMaterials.get(entity.id);

    // Create new objects
    if (!object) {
      object = new ThreeMaterial();
      renderStore.basicMaterials.set(entity.id, object);
    }
  }

  // Dispose unused objects
  for (const [id, object] of renderStore.basicMaterials) {
    if (!ids.includes(id)) {
      disposeMaterial(object);
      renderStore.basicMaterials.delete(id);
    }
  }
}
