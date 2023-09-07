import { ColliderDesc } from "@dimforge/rapier3d";
import { Parent } from "@houseki-engine/scene";
import { Entity, Query, Res, With } from "thyseus";

import { CylinderCollider } from "../../components";
import { PhysicsStore } from "../../resources";

export function createCylinderColliders(
  store: Res<PhysicsStore>,
  colliders: Query<[Entity, CylinderCollider]>,
  withParent: Query<[Entity, Parent], With<CylinderCollider>>
) {
  const ids: bigint[] = [];

  const parentIds = new Map<bigint, bigint>();

  for (const [entity, parent] of withParent) {
    parentIds.set(entity.id, parent.id);
  }

  for (const [entity, collider] of colliders) {
    ids.push(entity.id);

    let object = store.cylinderColliders.get(entity.id);

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

      const colliderDesc = ColliderDesc.cylinder(
        collider.height / 2,
        collider.radius
      );
      object = store.world.createCollider(colliderDesc, rigidbody);
      store.cylinderColliders.set(entity.id, object);
    }

    // Sync object properties
    object.setHalfHeight(collider.height / 2);
    object.setRadius(collider.radius);
  }

  // Remove colliders that are no longer in use
  for (const id of store.cylinderColliders.keys()) {
    if (!ids.includes(id)) {
      const object = store.cylinderColliders.get(id);
      if (object) store.world.removeCollider(object, true);

      store.cylinderColliders.delete(id);
    }
  }
}
