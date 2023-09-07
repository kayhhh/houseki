import { ColliderDesc } from "@dimforge/rapier3d";
import { Warehouse } from "@reddo/core";
import { Geometry, GlobalTransform, Parent } from "@reddo/scene";
import { Entity, Query, Res, With } from "thyseus";

import { MeshCollider } from "../../components";
import { PhysicsStore } from "../../resources";

export function createMeshColliders(
  warehouse: Res<Warehouse>,
  store: Res<PhysicsStore>,
  colliders: Query<[Entity, MeshCollider]>,
  withParent: Query<[Entity, Parent], With<MeshCollider>>,
  nodes: Query<[Entity, GlobalTransform]>,
  geometries: Query<[Entity, Geometry]>
) {
  const ids: bigint[] = [];

  const parentIds = new Map<bigint, bigint>();

  for (const [entity, parent] of withParent) {
    parentIds.set(entity.id, parent.id);
  }

  for (const [entity, collider] of colliders) {
    ids.push(entity.id);

    let object = store.meshColliders.get(entity.id);

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

      const meshId = collider.meshId || entity.id;

      for (const [geometryEntity, geometry] of geometries) {
        if (geometryEntity.id !== meshId) continue;

        const vertices = geometry.positions.read(warehouse);
        const indices = geometry.indices.read(warehouse);
        if (!vertices || !indices) continue;

        const scaledVertices = new Float32Array(vertices.length);

        // Scale vertices using global transform
        for (const [nodeEntity, globalTransform] of nodes) {
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

        const colliderDesc = ColliderDesc.trimesh(scaledVertices, indices);
        object = store.world.createCollider(colliderDesc, rigidbody);
        store.meshColliders.set(entity.id, object);
      }
    }
  }

  // Remove colliders that are no longer in use
  for (const id of store.meshColliders.keys()) {
    if (!ids.includes(id)) {
      const object = store.meshColliders.get(id);
      if (object) store.world.removeCollider(object, true);

      store.meshColliders.delete(id);
    }
  }
}
