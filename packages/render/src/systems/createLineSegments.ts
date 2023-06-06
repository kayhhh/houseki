import { LineSegments } from "@lattice-engine/scene";
import { LineSegments as ThreeLineSegments } from "three";
import { Entity, Query, Res } from "thyseus";

import { RenderStore } from "../resources";

export function createLineSegments(
  renderStore: Res<RenderStore>,
  entities: Query<[Entity, LineSegments]>
) {
  const ids: bigint[] = [];

  for (const [entity, lineSegments] of entities) {
    ids.push(entity.id);

    let object = renderStore.lineSegments.get(entity.id);

    // Create new objects
    if (!object) {
      object = new ThreeLineSegments();
      renderStore.lineSegments.set(entity.id, object);
    }

    // Sync object properties
    object.frustumCulled = lineSegments.frustumCulled;

    const geometry = renderStore.geometries.get(entity.id);
    if (geometry) object.geometry = geometry;

    const material =
      renderStore.lineMaterials.get(entity.id) ??
      renderStore.lineMaterials.get(lineSegments.materialId);
    if (material) object.material = material;

    // If this entity is a node, add the mesh to the node object
    const nodeObject = renderStore.nodes.get(entity.id);
    if (nodeObject) nodeObject.add(object);
    else object.removeFromParent();
  }

  // Remove unused objects
  for (const [id] of renderStore.lineSegments) {
    if (!ids.includes(id)) {
      renderStore.lineSegments.delete(id);
    }
  }
}
