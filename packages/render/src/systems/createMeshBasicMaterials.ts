import { MeshBasicMaterial } from "@lattice-engine/scene";
import {
  DoubleSide,
  FrontSide,
  MeshBasicMaterial as ThreeMaterial,
} from "three";
import { Entity, Query, Res } from "thyseus";

import { RenderStore } from "../resources";
import { disposeMaterial } from "../utils/dispose";

export function createMeshBasicMaterials(
  renderStore: Res<RenderStore>,
  entities: Query<[Entity, MeshBasicMaterial]>,
) {
  const ids: bigint[] = [];

  for (const [entity, material] of entities) {
    ids.push(entity.id);

    let object = renderStore.basicMaterials.get(entity.id);

    // Create new objects
    if (!object) {
      object = new ThreeMaterial();
      renderStore.basicMaterials.set(entity.id, object);
    }

    object.side = material.doubleSided ? DoubleSide : FrontSide;
  }

  // Dispose unused objects
  for (const [id, object] of renderStore.basicMaterials) {
    if (!ids.includes(id)) {
      disposeMaterial(object);
      renderStore.basicMaterials.delete(id);
    }
  }
}
