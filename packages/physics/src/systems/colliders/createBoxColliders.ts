import { ColliderDesc } from "@dimforge/rapier3d";
import {
  Entity,
  Query,
  QueryDescriptor,
  Res,
  ResourceDescriptor,
} from "thyseus";

import { BoxCollider } from "../../components";
import { PhysicsStore } from "../../PhysicsStore";

export function createBoxColliders(
  store: Res<PhysicsStore>,
  colliders: Query<[Entity, BoxCollider]>
) {
  const ids: bigint[] = [];

  for (const [entity, collider] of colliders) {
    ids.push(entity.id);

    let object = store.boxColliders.get(entity.id);
    const rigidbody = store.getRigidBody(entity.id);

    // Create new colliders
    if (!object || object.parent() !== rigidbody) {
      // Remove old collider
      if (object) store.world.removeCollider(object, true);

      const colliderDesc = ColliderDesc.cuboid(
        collider.size[0] / 2,
        collider.size[1] / 2,
        collider.size[2] / 2
      );
      object = store.world.createCollider(colliderDesc, rigidbody);
      store.boxColliders.set(entity.id, object);
    }

    // Sync object properties
    object.setHalfExtents({
      x: collider.size[0] / 2,
      y: collider.size[1] / 2,
      z: collider.size[2] / 2,
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

createBoxColliders.parameters = [
  ResourceDescriptor(PhysicsStore),
  QueryDescriptor([Entity, BoxCollider]),
];
