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
      const origin = {
        x: raycast.origin[0],
        y: raycast.origin[1],
        z: raycast.origin[2],
      };

      const direction = {
        x: raycast.direction[0],
        y: raycast.direction[1],
        z: raycast.direction[2],
      };

      object = new Ray(origin, direction);
      physicsStore.rays.set(entity.id, object);
    }

    object.origin.x = raycast.origin[0];
    object.origin.y = raycast.origin[1];
    object.origin.z = raycast.origin[2];

    object.dir.x = raycast.direction[0];
    object.dir.y = raycast.direction[1];
    object.dir.z = raycast.direction[2];

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
