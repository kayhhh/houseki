import { ColliderDesc } from "@dimforge/rapier3d";
import { Warehouse } from "@houseki-engine/core";
import { Geometry, GlobalTransform, Mesh, Parent } from "@houseki-engine/scene";
import { Entity, Query, Res, With } from "thyseus";

import { HullCollider } from "../../components";
import { PhysicsStore } from "../../resources";

export function createHullColliders(
  warehouse: Res<Warehouse>,
  store: Res<PhysicsStore>,
  colliders: Query<[Entity, HullCollider]>,
  withParent: Query<[Entity, Parent], With<HullCollider>>,
  globals: Query<[Entity, GlobalTransform]>,
  geometries: Query<[Entity, Geometry]>,
  meshes: Query<[Entity, Mesh]>
) {
  const ids: bigint[] = [];

  const parentIds = new Map<bigint, bigint>();

  for (const [entity, parent] of withParent) {
    parentIds.set(entity.id, parent.id);
  }

  for (const [entity, collider] of colliders) {
    ids.push(entity.id);

    const objects = store.hullColliders.get(entity.id);

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
    if (!objects || objects.every((c) => c.parent() !== rigidbody)) {
      // Remove old colliders
      if (objects) {
        for (const obj of objects) {
          store.world.removeCollider(obj, true);
        }

        store.hullColliders.delete(entity.id);
      }

      const meshId = collider.meshId || entity.id;

      // Create a collider for each mesh / geometry that has meshId as its parent
      for (const [meshEnt, mesh] of meshes) {
        if (mesh.parentId !== meshId) continue;

        for (const [geometryEntity, geometry] of geometries) {
          if (geometryEntity.id !== meshEnt.id) continue;

          const vertices = geometry.positions.read(warehouse);
          if (!vertices) continue;

          const scaledVertices = new Float32Array(vertices.length);

          // Scale vertices using global transform
          for (const [nodeEntity, globalTransform] of globals) {
            if (nodeEntity.id !== rigidbodyId) continue;

            for (let i = 0; i < vertices.length; i += 3) {
              const x = vertices[i] ?? 0;
              const y = vertices[i + 1] ?? 0;
              const z = vertices[i + 2] ?? 0;

              scaledVertices[i] = x * globalTransform.scale.x;
              scaledVertices[i + 1] = y * globalTransform.scale.y;
              scaledVertices[i + 2] = z * globalTransform.scale.z;
            }
          }

          const colliderDesc = ColliderDesc.convexHull(scaledVertices);
          if (!colliderDesc) continue;

          const object = store.world.createCollider(colliderDesc, rigidbody);

          const colliders = store.hullColliders.get(entity.id) ?? [];
          colliders.push(object);
          store.hullColliders.set(entity.id, colliders);
        }
      }
    }
  }

  // Remove colliders that are no longer in use
  for (const id of store.hullColliders.keys()) {
    if (!ids.includes(id)) {
      const objects = store.hullColliders.get(id);

      if (objects) {
        for (const obj of objects) {
          store.world.removeCollider(obj, true);
        }
      }

      store.hullColliders.delete(id);
    }
  }
}
