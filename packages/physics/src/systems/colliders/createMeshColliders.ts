import { ColliderDesc } from "@dimforge/rapier3d";
import { Warehouse } from "@houseki-engine/core";
import { Geometry, GlobalTransform, Mesh, Parent } from "@houseki-engine/scene";
import { Entity, Query, Res, With } from "thyseus";

import { MeshCollider } from "../../components";
import { PhysicsStore } from "../../resources";

export function createMeshColliders(
  warehouse: Res<Warehouse>,
  store: Res<PhysicsStore>,
  colliders: Query<[Entity, MeshCollider]>,
  withParent: Query<[Entity, Parent], With<MeshCollider>>,
  nodes: Query<[Entity, GlobalTransform]>,
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

    const objects = store.meshColliders.get(entity.id);

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

        store.meshColliders.delete(entity.id);
      }

      const meshId = collider.meshId || entity.id;

      // Create a collider for each mesh / geometry that has meshId as its parent
      for (const [meshEnt, mesh] of meshes) {
        if (mesh.parentId !== meshId) continue;

        for (const [geometryEnt, geometry] of geometries) {
          if (geometryEnt.id !== meshEnt.id) continue;

          const vertices = geometry.positions.read(warehouse);
          const indices = geometry.indices.read(warehouse);
          if (!vertices || !indices) continue;

          const scaledVertices = new Float32Array(vertices.length);

          // Scale vertices using global transform
          for (const [nodeEnt, globalTransform] of nodes) {
            if (nodeEnt.id !== rigidbodyId) continue;

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
          const object = store.world.createCollider(colliderDesc, rigidbody);

          const colliders = store.meshColliders.get(entity.id) ?? [];
          colliders.push(object);
          store.meshColliders.set(entity.id, colliders);
        }
      }
    }
  }

  // Remove colliders that are no longer in use
  for (const id of store.meshColliders.keys()) {
    if (!ids.includes(id)) {
      const objects = store.meshColliders.get(id);

      if (objects) {
        for (const obj of objects) {
          store.world.removeCollider(obj, true);
        }
      }

      store.meshColliders.delete(id);
    }
  }
}
