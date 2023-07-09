import { ColliderDesc } from "@dimforge/rapier3d";
import { Parent } from "@lattice-engine/scene";
import { Entity, Query, Res, With } from "thyseus";

import { CapsuleCollider } from "../../components";
import { PhysicsStore } from "../../resources";

export function createCapsuleColliders(
  store: Res<PhysicsStore>,
  colliders: Query<[Entity, CapsuleCollider]>,
  withParent: Query<[Entity, Parent], With<CapsuleCollider>>,
) {
  const ids: bigint[] = [];

  const parentIds = new Map<bigint, bigint>();

  for (const [entity, parent] of withParent) {
    parentIds.set(entity.id, parent.id);
  }

  for (const [entity, collider] of colliders) {
    ids.push(entity.id);

    let object = store.capsuleColliders.get(entity.id);

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

      const colliderDesc = ColliderDesc.capsule(
        collider.height / 2,
        collider.radius,
      );
      object = store.world.createCollider(colliderDesc, rigidbody);
      store.capsuleColliders.set(entity.id, object);
    }

    // Sync object properties
    object.setHalfHeight(collider.height / 2);
    object.setRadius(collider.radius);
  }

  // Remove colliders that are no longer in use
  for (const id of store.capsuleColliders.keys()) {
    if (!ids.includes(id)) {
      const object = store.capsuleColliders.get(id);
      if (object) store.world.removeCollider(object, true);

      store.capsuleColliders.delete(id);
    }
  }
}
