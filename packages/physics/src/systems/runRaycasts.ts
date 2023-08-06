import { Ray } from "@dimforge/rapier3d";
import { Entity, Mut, Query, Res } from "thyseus";

import { Raycast } from "../components";
import { PhysicsStore } from "../resources";

export function runRaycasts(
  physicsStore: Res<PhysicsStore>,
  raycasters: Query<[Entity, Mut<Raycast>]>,
) {
  for (const [entity, raycast] of raycasters) {
    let ray = physicsStore.rays.get(entity.id);

    if (!ray) {
      const origin = raycast.origin.toObject();
      const direction = raycast.direction.toObject();

      ray = new Ray(origin, direction);
      physicsStore.rays.set(entity.id, ray);
    }

    ray.origin.x = raycast.origin.x;
    ray.origin.y = raycast.origin.y;
    ray.origin.z = raycast.origin.z;

    ray.dir.x = raycast.direction.x;
    ray.dir.y = raycast.direction.y;
    ray.dir.z = raycast.direction.z;

    // Rapier throws an error if the ray direction is zero
    if (ray.dir.x === 0 && ray.dir.y === 0 && ray.dir.z === 0) {
      raycast.hit = false;
      raycast.hitToi = 0;
      raycast.hitEntityId = 0n;
      raycast.hitPosition.set(0, 0, 0);
      raycast.hitNormal.set(0, 0, 0);
      continue;
    }

    const rigidBody = physicsStore.getRigidBody(raycast.excludeRigidBodyId);

    // Cast the ray
    const hit = physicsStore.world.castRayAndGetNormal(
      ray,
      raycast.maxToi,
      raycast.solid,
      undefined,
      undefined,
      undefined,
      rigidBody,
    );

    if (hit) {
      raycast.hit = true;
      raycast.hitToi = hit.toi;
      raycast.hitEntityId = physicsStore.findColliderEntity(hit.collider) ?? 0n;

      raycast.hitNormal.fromObject(hit.normal);

      const hitPoint = ray.pointAt(hit.toi);
      raycast.hitPosition.fromObject(hitPoint);
    } else {
      raycast.hit = false;
      raycast.hitToi = 0;
      raycast.hitEntityId = 0n;
      raycast.hitPosition.set(0, 0, 0);
    }
  }
}
