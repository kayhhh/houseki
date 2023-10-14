import { Raycast } from "@houseki-engine/physics";
import {
  And,
  Commands,
  Entity,
  Mut,
  Query,
  SystemRes,
  With,
  Without,
} from "thyseus";

import {
  OriginalRotation,
  OriginalTransform,
  OriginalTranslation,
  PortalRaycast,
} from "../components";

class LocalRes {
  /**
   * PortalRaycast ID -> Raycast ID
   */
  readonly raycasts = new Map<bigint, bigint>();
}

/**
 * If no raycast ID, create a new raycast
 */
export function initPortalRaycasts(
  commands: Commands,
  localRes: SystemRes<LocalRes>,
  portalRaycasts: Query<[Entity, Mut<PortalRaycast>]>,
  withoutOriginals: Query<
    Entity,
    And<
      With<PortalRaycast>,
      Without<OriginalTransform, OriginalTranslation, OriginalRotation>
    >
  >
) {
  for (const entity of withoutOriginals) {
    commands
      .get(entity)
      .addType(OriginalTransform)
      .addType(OriginalTranslation)
      .addType(OriginalRotation);
  }

  const ids: bigint[] = [];

  for (const [entity, portalRaycast] of portalRaycasts) {
    ids.push(entity.id);

    if (portalRaycast.raycastId) continue;

    portalRaycast.raycastId = commands.spawn(true).addType(Raycast).id;

    localRes.raycasts.set(entity.id, portalRaycast.raycastId);
  }

  // Clean up
  for (const [entity] of portalRaycasts) {
    if (!ids.includes(entity.id)) {
      const raycastId = localRes.raycasts.get(entity.id);
      if (raycastId === undefined) continue;

      commands.despawnById(raycastId);
      localRes.raycasts.delete(entity.id);
    }
  }
}
