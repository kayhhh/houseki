import { ColliderDesc } from "@dimforge/rapier3d";
import { Warehouse } from "@lattice-engine/core";
import { Geometry } from "@lattice-engine/scene";
import { Entity, Query, Res } from "thyseus";

import { HullCollider } from "../../components";
import { PhysicsStore } from "../../resources";

export function createHullColliders(
  warehouse: Res<Warehouse>,
  store: Res<PhysicsStore>,
  colliders: Query<[Entity, HullCollider]>,
  geometries: Query<[Entity, Geometry]>
) {
  const ids: bigint[] = [];

  for (const [entity, collider] of colliders) {
    ids.push(entity.id);

    let object = store.hullColliders.get(entity.id);
    const rigidbody = store.getRigidBody(entity.id) ?? null;

    // Create new colliders
    if (!object || object.parent() !== rigidbody) {
      // Remove old collider
      if (object) store.world.removeCollider(object, true);

      if (!rigidbody) continue;

      const meshId = collider.meshId || entity.id;

      for (const [geometryEntity, geometry] of geometries) {
        if (geometryEntity.id !== meshId) continue;

        const vertices = geometry.positions.read(warehouse);

        const colliderDesc = ColliderDesc.convexHull(vertices);
        if (!colliderDesc) continue;

        object = store.world.createCollider(colliderDesc, rigidbody);
        store.hullColliders.set(entity.id, object);
      }
    }
  }

  // Remove colliders that are no longer in use
  for (const id of store.hullColliders.keys()) {
    if (!ids.includes(id)) {
      const object = store.hullColliders.get(id);
      if (object) store.world.removeCollider(object, true);

      store.hullColliders.delete(id);
    }
  }
}
