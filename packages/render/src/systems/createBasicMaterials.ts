import { BasicMaterial } from "@reddo/scene";
import { DoubleSide, FrontSide, MeshBasicMaterial } from "three";
import { Entity, Query, Res } from "thyseus";

import { RenderStore } from "../resources";
import { disposeMaterial } from "../utils/dispose";

export function createBasicMaterials(
  renderStore: Res<RenderStore>,
  entities: Query<[Entity, BasicMaterial]>
) {
  const ids: bigint[] = [];

  for (const [entity, material] of entities) {
    ids.push(entity.id);

    let object = renderStore.basicMaterials.get(entity.id);

    // Create new objects
    if (!object) {
      object = new MeshBasicMaterial();
      renderStore.basicMaterials.set(entity.id, object);
    }

    object.side = material.doubleSided ? DoubleSide : FrontSide;
    object.colorWrite = material.colorWrite;
  }

  // Dispose unused objects
  for (const [id, object] of renderStore.basicMaterials) {
    if (!ids.includes(id)) {
      disposeMaterial(object);
      renderStore.basicMaterials.delete(id);
    }
  }
}
