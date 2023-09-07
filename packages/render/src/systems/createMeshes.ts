import { Geometry, Mesh, MeshMode } from "@houseki-engine/scene";
import {
  BufferGeometry,
  Line,
  LineLoop,
  LineSegments,
  Mesh as ThreeMesh,
  Points,
} from "three";
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
      switch (mesh.mode) {
        case MeshMode.TRIANGLES ||
          MeshMode.TRIANGLE_STRIP ||
          MeshMode.TRIANGLE_FAN: {
          object = new ThreeMesh();
          object.castShadow = true;
          object.receiveShadow = true;
          break;
        }

        case MeshMode.LINES: {
          object = new LineSegments();
          break;
        }

        case MeshMode.LINE_STRIP: {
          object = new Line();
          break;
        }

        case MeshMode.LINE_LOOP: {
          object = new LineLoop();
          break;
        }

        case MeshMode.POINTS: {
          object = new Points();
          break;
        }

        default: {
          console.warn(`Unknown mesh mode: ${mesh.mode}`);
        }
      }

      if (!object) continue;

      store.meshes.set(entity.id, object);
    }

    // Sync object properties
    object.frustumCulled = mesh.frustumCulled;

    const materialObject =
      store.getMaterial(mesh.materialId) ?? store.getMaterial(entity.id);
    object.material = materialObject ?? RenderStore.DEFAULT_MATERIAL;

    const geometryObject = store.geometries.get(entity.id);
    object.geometry = geometryObject ?? new BufferGeometry();

    const parentId = mesh.parentId || entity.id;
    const parentObject = store.nodes.get(parentId);

    if (parentObject) {
      parentObject.add(object);
    } else {
      object.removeFromParent();
    }
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
