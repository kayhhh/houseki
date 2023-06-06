import { ColliderDesc } from "@dimforge/rapier3d";
import { Entity, Query, Res } from "thyseus";

import { CylinderCollider } from "../../components";
import { PhysicsStore } from "../../resources";

export function createCylinderColliders(
  store: Res<PhysicsStore>,
  colliders: Query<[Entity, CylinderCollider]>
) {
  const ids: bigint[] = [];

  for (const [entity, collider] of colliders) {
    ids.push(entity.id);

    let object = store.cylinderColliders.get(entity.id);
    const rigidbody = store.getRigidBody(entity.id) ?? null;

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
