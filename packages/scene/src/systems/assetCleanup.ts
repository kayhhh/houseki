import { Asset, Warehouse } from "@lattice-engine/core";
import { Commands, Entity, Query, Res, SystemRes } from "thyseus";

class EntityTracker {
  ids = new Set<bigint>();

  /**
   * Entity ID -> Resource IDs
   */
  resources = new Map<bigint, Set<number>>();
}

export function assetCleanup(
  commands: Commands,
  warehouse: Res<Warehouse>,
  tracker: SystemRes<EntityTracker>,
  entities: Query<[Entity, Asset]>,
) {
  const ids: bigint[] = [];

  for (const [entity, asset] of entities) {
    ids.push(entity.id);
    tracker.ids.add(entity.id);

    const resources = tracker.resources.get(entity.id) ?? new Set();
    resources.add(asset.data.id);

    tracker.resources.set(entity.id, resources);
  }

  // Clean up removed entities
  for (const id of tracker.ids) {
    if (!ids.includes(id)) {
      const resources = tracker.resources.get(id);

      if (resources) {
        for (const resource of resources) {
          warehouse.delete(resource);
        }

        tracker.resources.delete(id);
      }

      commands.despawnById(id);
    }
  }
}
