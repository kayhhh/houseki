import { Raycast } from "@houseki-engine/physics";
import { GlobalTransform } from "@houseki-engine/scene";
import { Quaternion, Vector3 } from "three";
import { Entity, Mut, Query } from "thyseus";

import { PortalRaycast, PortalTarget } from "../components";

const quaternion_a = new Quaternion();
const quaternion_b = new Quaternion();
const vec3_a = new Vector3();
const vec3_b = new Vector3();

export function setPortalRaycasts(
  portalRaycasts: Query<[Raycast, Mut<PortalRaycast>]>,
  raycasts: Query<[Entity, Mut<Raycast>]>,
  portals: Query<[Entity, PortalTarget, GlobalTransform]>
) {
  for (const [raycast1, portalRaycast] of portalRaycasts) {
    const wasActive = portalRaycast.active;

    portalRaycast.active = false;
    portalRaycast.firstFrame = false;
    portalRaycast.enterPortalId = 0n;
    portalRaycast.exitPortalId = 0n;

    if (!raycast1.hit) continue;

    for (const [portalEnt, portalTarget, portalEnterGlobal] of portals) {
      if (raycast1.hitEntityId !== portalEnt.id) continue;

      if (!wasActive) portalRaycast.firstFrame = true;

      portalRaycast.active = true;
      portalRaycast.enterPortalId = portalEnt.id;
      portalRaycast.exitPortalId = portalTarget.id;

      // Get portal raycast
      for (const [raycastEnt, raycast2] of raycasts) {
        if (portalRaycast.raycastId !== raycastEnt.id) continue;

        raycast2.excludeRigidBodyId = portalTarget.id;

        // Set portal raycast max toi to the remaining distance the raycast can travel
        raycast2.maxToi = raycast1.maxToi - raycast1.hitToi;

        for (const [targetEnt, , portalExitGlobal] of portals) {
          if (targetEnt.id !== portalTarget.id) continue;

          // 1. Get relative position of raycast hit on entrance portal
          quaternion_a
            .set(
              portalEnterGlobal.rotation.x,
              portalEnterGlobal.rotation.y,
              portalEnterGlobal.rotation.z,
              portalEnterGlobal.rotation.w
            )
            .invert();

          vec3_a.set(
            raycast1.hitPosition.x,
            raycast1.hitPosition.y,
            raycast1.hitPosition.z
          );

          vec3_b.set(
            portalEnterGlobal.translation.x,
            portalEnterGlobal.translation.y,
            portalEnterGlobal.translation.z
          );

          vec3_a.sub(vec3_b);
          vec3_a.applyQuaternion(quaternion_a);

          // Mirror relative position
          vec3_a.x *= -1;
          vec3_a.z *= -1;

          // 2. Set raycast2 origin to the other side of the portal
          quaternion_b.set(
            portalExitGlobal.rotation.x,
            portalExitGlobal.rotation.y,
            portalExitGlobal.rotation.z,
            portalExitGlobal.rotation.w
          );

          vec3_b.set(
            portalExitGlobal.translation.x,
            portalExitGlobal.translation.y,
            portalExitGlobal.translation.z
          );

          vec3_a.applyQuaternion(quaternion_b);
          vec3_a.add(vec3_b);

          raycast2.origin.x = vec3_a.x;
          raycast2.origin.y = vec3_a.y;
          raycast2.origin.z = vec3_a.z;

          // 3. Set raycast2 direction, rotated through the portals
          vec3_a.set(
            raycast1.direction.x,
            raycast1.direction.y,
            raycast1.direction.z
          );

          quaternion_b.set(
            portalExitGlobal.rotation.x,
            portalExitGlobal.rotation.y,
            portalExitGlobal.rotation.z,
            portalExitGlobal.rotation.w
          );

          vec3_a.applyQuaternion(quaternion_a);
          vec3_a.applyQuaternion(quaternion_b);

          // Add a dash of magic 🪄
          vec3_a.z *= -1;

          raycast2.direction.x = vec3_a.x;
          raycast2.direction.y = vec3_a.y;
          raycast2.direction.z = vec3_a.z;
        }
      }
    }
  }
}
