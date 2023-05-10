import { Commands, Entity, Query, Res, SystemRes } from "thyseus";
import {
  CommandsDescriptor,
  QueryDescriptor,
  ResourceDescriptor,
  SystemResourceDescriptor,
} from "thyseus";

import { Warehouse } from "../warehouse/Warehouse";
import { Geometry, Material } from "./components";

class EntityTracker {
  ids = new Set<bigint>();

  /**
   * Entity ID -> Resource IDs
   */
  resources = new Map<bigint, Set<number>>();
}

/**
 * Cleans up gemetry resources on removal.
 */
export function geometryCleanup(
  commands: Commands,
  warehouse: Res<Warehouse>,
  tracker: SystemRes<EntityTracker>,
  entities: Query<[Entity, Geometry]>
) {
  const ids: bigint[] = [];

  for (const [{ id }, geometry] of entities) {
    ids.push(id);
    tracker.ids.add(id);

    const resources = tracker.resources.get(id) ?? new Set();

    resources.add(geometry.positions.id);
    resources.add(geometry.normals.id);
    resources.add(geometry.uvs.id);
    resources.add(geometry.indices.id);

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

geometryCleanup.parameters = [
  CommandsDescriptor(),
  ResourceDescriptor(Warehouse),
  SystemResourceDescriptor(EntityTracker),
  QueryDescriptor([Entity, Geometry]),
];

/**
 * Cleans up material resources on removal.
 */
export function materialCleanup(
  commands: Commands,
  warehouse: Res<Warehouse>,
  tracker: SystemRes<EntityTracker>,
  entities: Query<[Entity, Material]>
) {
  const ids: bigint[] = [];

  for (const [{ id }, material] of entities) {
    ids.push(id);
    tracker.ids.add(id);

    const resources = tracker.resources.get(id) ?? new Set();

    resources.add(material.baseColorTexture.image.id);
    resources.add(material.metallicRoughnessTexture.image.id);
    resources.add(material.normalTexture.image.id);
    resources.add(material.occlusionTexture.image.id);
    resources.add(material.emissiveTexture.image.id);

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

materialCleanup.parameters = [
  CommandsDescriptor(),
  ResourceDescriptor(Warehouse),
  SystemResourceDescriptor(EntityTracker),
  QueryDescriptor([Entity, Material]),
];
