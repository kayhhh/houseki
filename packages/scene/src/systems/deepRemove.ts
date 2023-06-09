import { Entity, EventReader, Query, With } from "thyseus";

import { Image, Material, Mesh, Parent, Transform } from "../components";
import { DeepRemove } from "../events";

export function deepRemove(
  events: EventReader<DeepRemove>,
  nodes: Query<[Entity, Parent], With<Transform>>,
  meshes: Query<[Entity, Mesh]>,
  materials: Query<[Entity, Material]>,
  images: Query<Entity, With<Image>>
) {
  if (events.length === 0) return;

  const despawned = new Set<bigint>();

  const despawn = (entity: Readonly<Entity>) => {
    if (despawned.has(entity.id)) return;
    despawned.add(entity.id);
    entity.despawn();
  };

  for (const event of events) {
    const parentIds = new Set<bigint>();
    parentIds.add(event.rootId);

    for (const [entity, parent] of nodes) {
      if (!parentIds.has(parent.id)) continue;
      parentIds.add(entity.id);
      despawn(entity);
    }

    const materialIds = new Set<bigint>();

    for (const [entity, mesh] of meshes) {
      if (!parentIds.has(mesh.parentId)) continue;
      materialIds.add(mesh.materialId);
      despawn(entity);
    }

    const imageIds = new Set<bigint>();

    for (const [entity, material] of materials) {
      if (!materialIds.has(entity.id)) continue;
      imageIds.add(material.baseColorTextureId);
      imageIds.add(material.metallicRoughnessTextureId);
      imageIds.add(material.normalTextureId);
      imageIds.add(material.occlusionTextureId);
      imageIds.add(material.emissiveTextureId);
      despawn(entity);
    }

    for (const entity of images) {
      if (!imageIds.has(entity.id)) continue;
      despawn(entity);
    }
  }

  events.clear();
}
