import { Parent, Transform } from "@reddo/scene";
import { Object3D } from "three";
import { Entity, Query, Res } from "thyseus";

import { RenderStore } from "../resources";

/**
 * Creates and updates node objects.
 */
export function createNodes(
  store: Res<RenderStore>,
  entities: Query<[Entity, Transform, Parent]>
) {
  const ids: bigint[] = [];

  for (const [entity, transform, parent] of entities) {
    ids.push(entity.id);

    let object = store.nodes.get(entity.id);

    // Create new objects
    if (!object) {
      object = new Object3D();
      store.nodes.set(entity.id, object);
    }

    // Sync object properties
    object.position.set(
      transform.translation.x,
      transform.translation.y,
      transform.translation.z
    );
    object.quaternion.set(
      transform.rotation.x,
      transform.rotation.y,
      transform.rotation.z,
      transform.rotation.w
    );
    object.scale.set(transform.scale.x, transform.scale.y, transform.scale.z);

    if (parent.id === entity.id) {
      console.error("Node cannot be its own parent");
      continue;
    }

    const parentObject =
      store.nodes.get(parent.id) ?? store.scenes.get(parent.id);

    if (parentObject && object.parent !== parentObject) {
      parentObject.add(object);
    }
  }

  // Remove objects that no longer exist
  for (const [id] of store.nodes) {
    if (!ids.includes(id)) {
      const object = store.nodes.get(id);
      object?.removeFromParent();

      store.nodes.delete(id);
    }
  }
}
