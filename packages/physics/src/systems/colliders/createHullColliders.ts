import { ColliderDesc } from "@dimforge/rapier3d";
import { Warehouse } from "@reddo/core";
import { Geometry, Parent } from "@reddo/scene";
import { Entity, Query, Res, With } from "thyseus";

import { HullCollider } from "../../components";
import { PhysicsStore } from "../../resources";

export function createHullColliders(
  warehouse: Res<Warehouse>,
  store: Res<PhysicsStore>,
  colliders: Query<[Entity, HullCollider]>,
  withParent: Query<[Entity, Parent], With<HullCollider>>,
  geometries: Query<[Entity, Geometry]>
) {
  const ids: bigint[] = [];

  const parentIds = new Map<bigint, bigint>();

  for (const [entity, parent] of withParent) {
    parentIds.set(entity.id, parent.id);
  }

  for (const [entity, collider] of colliders) {
    ids.push(entity.id);

    let object = store.hullColliders.get(entity.id);

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

      const meshId = collider.meshId || entity.id;

      for (const [geometryEntity, geometry] of geometries) {
        if (geometryEntity.id !== meshId) continue;

        const positions = geometry.positions.read(warehouse);
        if (!positions) continue;

        const colliderDesc = ColliderDesc.convexHull(positions);
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
