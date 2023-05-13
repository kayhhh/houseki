import { ColliderDesc } from "@dimforge/rapier3d";
import {
  Entity,
  Query,
  QueryDescriptor,
  Res,
  ResourceDescriptor,
} from "thyseus";

import { SphereCollider } from "../../components";
import { PhysicsStore } from "../../PhysicsStore";

export function createSphereColliders(
  store: Res<PhysicsStore>,
  colliders: Query<[Entity, SphereCollider]>
) {
  const ids: bigint[] = [];

  for (const [entity, collider] of colliders) {
    ids.push(entity.id);

    let object = store.sphereColliders.get(entity.id);
    const rigidbody = store.getRigidBody(entity.id);

    // Create new colliders
    if (!object || object.parent() !== rigidbody) {
      // Remove old collider
      if (object) store.world.removeCollider(object, true);

      const colliderDesc = ColliderDesc.ball(collider.radius);
      object = store.world.createCollider(colliderDesc, rigidbody);
      store.sphereColliders.set(entity.id, object);
    }

    // Sync object properties
    object.setRadius(collider.radius);
  }

  // Remove colliders that are no longer in use
  for (const id of store.sphereColliders.keys()) {
    if (!ids.includes(id)) {
      const object = store.sphereColliders.get(id);
      if (object) store.world.removeCollider(object, true);

      store.sphereColliders.delete(id);
    }
  }
}

createSphereColliders.parameters = [
  ResourceDescriptor(PhysicsStore),
  QueryDescriptor([Entity, SphereCollider]),
];
