import { Warehouse } from "@lattice-engine/core";
import { Commands, Entity, Query, Res, SystemRes } from "thyseus";

import { Geometry, KeyframeTrack, Texture } from "./components";

class EntityTracker {
  ids = new Set<bigint>();

  /**
   * Entity ID -> Resource IDs
   */
  resources = new Map<bigint, Set<number>>();
}

/**
 * Cleans up geometry resources on removal.
 */
export function geometryCleanup(
  commands: Commands,
  warehouse: Res<Warehouse>,
  tracker: SystemRes<EntityTracker>,
  entities: Query<[Entity, Geometry]>
) {
  const ids: bigint[] = [];

  for (const [entity, geometry] of entities) {
    ids.push(entity.id);
    tracker.ids.add(entity.id);

    const resources = tracker.resources.get(entity.id) ?? new Set();

    resources.add(geometry.positions.id);
    resources.add(geometry.normals.id);
    resources.add(geometry.uvs.id);
    resources.add(geometry.indices.id);

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

      commands.despawn(id);
    }
  }
}

/**
 * Cleans up texture resources on removal.
 */
export function textureCleanup(
  commands: Commands,
  warehouse: Res<Warehouse>,
  tracker: SystemRes<EntityTracker>,
  entities: Query<[Entity, Texture]>
) {
  const ids: bigint[] = [];

  for (const [entity, texture] of entities) {
    ids.push(entity.id);
    tracker.ids.add(entity.id);

    const resources = tracker.resources.get(entity.id) ?? new Set();
    resources.add(texture.image.id);

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

      commands.despawn(id);
    }
  }
}

/**
 * Cleans up animation resources on removal.
 */
export function keyframeTrackCleanup(
  commands: Commands,
  warehouse: Res<Warehouse>,
  tracker: SystemRes<EntityTracker>,
  entities: Query<[Entity, KeyframeTrack]>
) {
  const ids: bigint[] = [];

  for (const [entity, track] of entities) {
    ids.push(entity.id);
    tracker.ids.add(entity.id);

    const resources = tracker.resources.get(entity.id) ?? new Set();
    resources.add(track.times.id);
    resources.add(track.values.id);

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

      commands.despawn(id);
    }
  }
}
