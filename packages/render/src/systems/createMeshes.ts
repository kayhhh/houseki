import { Geometry, Mesh } from "@lattice-engine/scene";
import { BufferGeometry, Mesh as ThreeMesh } from "three";
import { Entity, Query, Res, With } from "thyseus";

import { RenderStore } from "../resources";

/**
 * Creates and updates mesh objects.
 */
export function createMeshes(
  store: Res<RenderStore>,
  entities: Query<[Entity, Mesh], With<Geometry>>
) {
  const ids: bigint[] = [];

  for (const [entity, mesh] of entities) {
    ids.push(entity.id);

    let object = store.meshes.get(entity.id);

    // Create new objects
    if (!object) {
      object = new ThreeMesh();
      object.castShadow = true;
      object.receiveShadow = true;

      store.meshes.set(entity.id, object);
    }

    // Sync object properties
    const materialObject =
      store.materials.get(mesh.materialId) ?? store.materials.get(entity.id);
    object.material = materialObject ?? RenderStore.DEFAULT_MATERIAL;

    const geometryObject = store.geometries.get(entity.id);
    object.geometry = geometryObject ?? new BufferGeometry();

    const parentId = mesh.parentId || entity.id;
    const parentObject = store.nodes.get(parentId);
    if (parentObject) parentObject.add(object);
    else object.removeFromParent();
  }

  // Remove objects that no longer exist
  for (const [id] of store.meshes) {
    if (!ids.includes(id)) {
      const object = store.meshes.get(id);
      object?.removeFromParent();

      store.meshes.delete(id);
    }
  }
}
