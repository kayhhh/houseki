import { Raycast } from "@lattice-engine/physics";
import { GlobalTransform } from "@lattice-engine/scene";
import { Entity, Mut, Query } from "thyseus";

import { PortalRaycast, PortalTarget } from "../components";

export function setPortalRaycasts(
  raycasts: Query<[Raycast, Mut<PortalRaycast>]>,
  portals: Query<[Entity, PortalTarget, GlobalTransform]>
) {
  for (const [raycast, portalRaycast] of raycasts) {
    if (!raycast.hit) continue;

    for (const [portalEnt, portalTarget, portalGlobalTransform] of portals) {
      if (raycast.hitEntityId !== portalEnt.id) continue;

      // Get relative position of raycast hit to portal
      const relativeX =
        raycast.hitPosition.x - portalGlobalTransform.translation.x;
      const relativeY =
        raycast.hitPosition.y - portalGlobalTransform.translation.y;
      const relativeZ =
        raycast.hitPosition.z - portalGlobalTransform.translation.z;

      portalRaycast.excludeRigidBodyId = portalTarget.id;

      for (const [targetEnt, , targetGlobalTransform] of portals) {
        if (targetEnt.id !== portalTarget.id) continue;

        // Set raycast origin to other side of portal
        // With mirrored relative offset applied
        portalRaycast.origin.x =
          targetGlobalTransform.translation.x - relativeX;
        portalRaycast.origin.y =
          targetGlobalTransform.translation.y + relativeY;
        portalRaycast.origin.z =
          targetGlobalTransform.translation.z - relativeZ;

        // Set raycast direction to other side of portal
        // Reflected across the portal
        portalRaycast.direction.x = -raycast.direction.x;
        portalRaycast.direction.z = -raycast.direction.z;
      }
    }
  }
}
