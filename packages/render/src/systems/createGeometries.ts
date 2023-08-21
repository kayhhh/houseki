import { Geometry } from "@lattice-engine/scene";
import { BufferAttribute, BufferGeometry } from "three";
import { Entity, Query, Res } from "thyseus";

import { RenderStore } from "../resources";

/**
 * Creates and updates geometry objects.
 */
export function createGeometries(
  store: Res<RenderStore>,
  entities: Query<[Geometry, Entity]>,
) {
  const ids: bigint[] = [];

  for (const [geometry, entity] of entities) {
    ids.push(entity.id);

    let object = store.geometries.get(entity.id);

    // Create new objects
    if (!object) {
      object = new BufferGeometry();
      store.geometries.set(entity.id, object);
    }

    // Sync object properties
    setAttribute(object, "color", geometry.colors, 4);
    setAttribute(object, "position", geometry.positions, 3);
    setAttribute(object, "normal", geometry.normals, 3);
    setAttribute(object, "uv", geometry.uv, 2);
    setAttribute(object, "uv1", geometry.uv1, 2);
    setAttribute(object, "uv2", geometry.uv2, 2);
    setAttribute(object, "uv3", geometry.uv3, 2);
    setAttribute(object, "skinIndex", geometry.joints, 4);
    setAttribute(object, "skinWeight", geometry.weights, 4);
    setAttribute(object, "index", geometry.indices, 1);
  }

  // Remove objects that no longer exist
  for (const [id] of store.geometries) {
    if (!ids.includes(id)) {
      const object = store.geometries.get(id);
      if (object) object.dispose();

      store.geometries.delete(id);
    }
  }
}

/**
 * Sets a BufferGeometry attribute to a given array,
 * creating a new attribute if one does not already exist.
 * Also supports setting the index.
 */
function setAttribute(
  geometry: BufferGeometry,
  name: string,
  data: ArrayLike<number>,
  itemSize: number,
) {
  const attribute =
    name === "index" ? geometry.getIndex() : geometry.getAttribute(name);

  if (
    attribute instanceof BufferAttribute &&
    attribute.itemSize === itemSize &&
    attribute.array.length === data.length
  ) {
    // Ignore if data is already set
    if (attribute.array === data) return;

    // Reuse existing attribute
    attribute.set(data);
    attribute.needsUpdate = true;
  } else {
    // Create new attribute
    if (name === "index") {
      const array = new Uint32Array(data);
      const attribute = new BufferAttribute(array, 1);
      geometry.setIndex(attribute);
    } else {
      const array = new Float32Array(data);
      const attribute = new BufferAttribute(array, itemSize);
      geometry.setAttribute(name, attribute);
    }
  }
}
