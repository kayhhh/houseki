import { ColliderDesc } from "@dimforge/rapier3d";
import { Parent } from "@reddo/scene";
import { Entity, Query, Res, With } from "thyseus";

import { BoxCollider } from "../../components";
import { PhysicsStore } from "../../resources";

export function createBoxColliders(
  store: Res<PhysicsStore>,
  colliders: Query<[Entity, BoxCollider]>,
  withParent: Query<[Entity, Parent], With<BoxCollider>>
) {
  const ids: bigint[] = [];

  const parentIds = new Map<bigint, bigint>();

  for (const [entity, parent] of withParent) {
    parentIds.set(entity.id, parent.id);
  }

  for (const [entity, collider] of colliders) {
    ids.push(entity.id);

    let object = store.boxColliders.get(entity.id);

    let rigidbodyId = entity.id;
    let rigidbody = store.getRigidBody(rigidbodyId);
    if (!rigidbody) {
      const parentId = parentIds.get(entity.id);
      if (parentId) {
        rigidbodyId = parentId;
        rigidbody = store.getRigidBody(parentId);
      }
    }
    if (!rigidbody) continue;

    // Create new colliders
    if (!object || object.parent() !== rigidbody) {
      // Remove old collider
      if (object) store.world.removeCollider(object, true);

      if (!rigidbody) continue;

      const colliderDesc = ColliderDesc.cuboid(
        collider.size.x / 2,
        collider.size.y / 2,
        collider.size.z / 2
      );
      object = store.world.createCollider(colliderDesc, rigidbody);
      store.boxColliders.set(entity.id, object);
    }

    // Sync object properties
    object.setHalfExtents({
      x: collider.size.x / 2,
      y: collider.size.y / 2,
      z: collider.size.z / 2,
    });
  }

  // Remove colliders that are no longer in use
  for (const id of store.boxColliders.keys()) {
    if (!ids.includes(id)) {
      const object = store.boxColliders.get(id);
      if (object) store.world.removeCollider(object, true);

      store.boxColliders.delete(id);
    }
  }
}
