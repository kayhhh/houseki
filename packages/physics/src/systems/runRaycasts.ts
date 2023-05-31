import { Ray } from "@dimforge/rapier3d";
import { Entity, Mut, Query, Res } from "thyseus";

import { Raycast } from "../components";
import { PhysicsStore } from "../resources";

export function runRaycasts(
  physicsStore: Res<PhysicsStore>,
  raycasters: Query<[Entity, Mut<Raycast>]>
) {
  for (const [entity, raycast] of raycasters) {
    let object = physicsStore.rays.get(entity.id);

    if (!object) {
      const origin = raycast.origin.toObject();
      const direction = raycast.direction.toObject();

      object = new Ray(origin, direction);
      physicsStore.rays.set(entity.id, object);
    }

    object.origin.x = raycast.origin.x;
    object.origin.y = raycast.origin.y;
    object.origin.z = raycast.origin.z;

    object.dir.x = raycast.direction.x;
    object.dir.y = raycast.direction.y;
    object.dir.z = raycast.direction.z;

    const rigidBody = physicsStore.getRigidBody(raycast.excludeRigidBodyId);

    // Cast the ray
    const hit = physicsStore.world.castRay(
      object,
      raycast.maxToi,
      raycast.solid,
      undefined,
      undefined,
      undefined,
      rigidBody
    );

    if (hit) {
      raycast.hit = true;
      raycast.hitToi = hit.toi;
    } else {
      raycast.hit = false;
      raycast.hitToi = 0;
    }
  }
}
