import { Warehouse } from "@lattice-engine/core";
import { defineSystem, Entity } from "thyseus";

import { GltfUri } from "../components";

class EntityTracker {
  ids: bigint[] = [];

  /**
   * Entity ID -> Resource IDs
   */
  resources = new Map<bigint, Set<number>>();
}

/**
 * Cleans up GltfUri resources on removal.
 */
export const gltfCleanup = defineSystem(
  ({ SystemRes, Res, Commands, Query }) => [
    Commands(),
    Res(Warehouse),
    SystemRes(EntityTracker),
    Query([Entity, GltfUri]),
  ],
  (commands, warehouse, tracker, entities) => {
    const ids: bigint[] = [];

    for (const [{ id }, gltf] of entities) {
      ids.push(id);

      const resources = tracker.resources.get(id) ?? new Set();

      resources.add(gltf.uri.id);

      tracker.resources.set(id, resources);
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

        commands.despawn(id);
      }
    }
  }
);
