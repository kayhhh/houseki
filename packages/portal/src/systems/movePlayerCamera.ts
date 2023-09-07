import { Raycast } from "@houseki-engine/physics";
import {
  COLLISION_OFFSET,
  PlayerCamera,
  PlayerCameraView,
  TargetTranslation,
} from "@houseki-engine/player";
import { Transform } from "@houseki-engine/scene";
import { Vector3 } from "three";
import { Entity, Mut, Query, With } from "thyseus";

import { Portal, PortalRaycast } from "../components";

const vec3_a = new Vector3();
const vec3_c = new Vector3();

export function movePlayerCamera(
  cameras: Query<
    [PlayerCamera, Mut<TargetTranslation>, Mut<Transform>, Mut<PortalRaycast>]
  >,
  raycasts: Query<[Entity, Raycast]>,
  portals: Query<Entity, With<Portal>>
) {
  for (const [camera, targetTranslation, transform, portalRaycast] of cameras) {
    if (!portalRaycast.active) continue;

    for (const [raycastEnt, raycast2] of raycasts) {
      if (portalRaycast.raycastId !== raycastEnt.id) continue;

      for (const enterEnt of portals) {
        if (portalRaycast.enterPortalId !== enterEnt.id) continue;

        for (const exitEnt of portals) {
          if (portalRaycast.exitPortalId !== exitEnt.id) continue;

          if (camera.currentView === PlayerCameraView.ThirdPerson) {
            const distance = raycast2.hit
              ? raycast2.hitToi * COLLISION_OFFSET
              : raycast2.maxToi;

            vec3_a.set(raycast2.origin.x, raycast2.origin.y, raycast2.origin.z);

            vec3_c.set(
              -raycast2.direction.x,
              raycast2.direction.y,
              raycast2.direction.z
            );

            vec3_c.multiplyScalar(distance);
            vec3_a.add(vec3_c);

            targetTranslation.x = vec3_a.x;
            targetTranslation.y = vec3_a.y;
            targetTranslation.z = vec3_a.z;

            // Teleport first frame, don't lerp
            if (portalRaycast.firstFrame) {
              transform.translation.x = vec3_a.x;
              transform.translation.y = vec3_a.y;
              transform.translation.z = vec3_a.z;
            }
          }
        }
      }
    }
  }
}
