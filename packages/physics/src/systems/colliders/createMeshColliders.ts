import { ColliderDesc } from "@dimforge/rapier3d";
import { Warehouse } from "@lattice-engine/core";
import { Geometry, GlobalTransform } from "@lattice-engine/scene";
import { Entity, Query, Res } from "thyseus";

import { MeshCollider } from "../../components";
import { PhysicsStore } from "../../resources";

export function createMeshColliders(
  warehouse: Res<Warehouse>,
  store: Res<PhysicsStore>,
  colliders: Query<[Entity, MeshCollider, GlobalTransform]>,
  geometries: Query<[Entity, Geometry]>
) {
  const ids: bigint[] = [];

  for (const [entity, collider, globalTransform] of colliders) {
    ids.push(entity.id);

    let object = store.meshColliders.get(entity.id);
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
        const indices = geometry.indices.read(warehouse);

        // Scale vertices
        for (let i = 0; i < vertices.length; i += 3) {
          vertices[i] *= globalTransform.scale.x;
          vertices[i + 1] *= globalTransform.scale.y;
          vertices[i + 2] *= globalTransform.scale.z;
        }

        let indices32: Uint32Array;

        if (indices instanceof Uint16Array) {
          indices32 = new Uint32Array(indices.length);
          for (let i = 0; i < indices.length; i++) {
            indices32[i] = indices[i] ?? 0;
          }
        } else {
          indices32 = indices;
        }

        const colliderDesc = ColliderDesc.trimesh(vertices, indices32);

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
