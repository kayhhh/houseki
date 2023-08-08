import { Commands, Entity, EventReader, Query, With } from "thyseus";

import {
  BasicMaterial,
  Image,
  Mesh,
  Parent,
  StandardMaterial,
  Transform,
} from "../components";
import { DeepRemove } from "../events";

export function deepRemove(
  commands: Commands,
  events: EventReader<DeepRemove>,
  nodes: Query<[Entity, Parent], With<Transform>>,
  meshes: Query<[Entity, Mesh]>,
  basicMaterials: Query<Entity, With<BasicMaterial>>,
  standardMaterials: Query<[Entity, StandardMaterial]>,
  images: Query<Entity, With<Image>>,
) {
  if (events.length === 0) return;

  for (const event of events) {
    const parentIds = new Set<bigint>();
    parentIds.add(event.rootId);

    for (const [entity, parent] of nodes) {
      if (!parentIds.has(parent.id)) continue;
      parentIds.add(entity.id);
      commands.despawnById(entity.id);
    }

    const materialIds = new Set<bigint>();

    for (const [entity, mesh] of meshes) {
      if (!parentIds.has(mesh.parentId)) continue;
      materialIds.add(mesh.materialId);
      commands.despawnById(entity.id);
    }

    for (const entity of basicMaterials) {
      if (!materialIds.has(entity.id)) continue;
      commands.despawnById(entity.id);
    }

    const imageIds = new Set<bigint>();

    for (const [entity, material] of standardMaterials) {
      if (!materialIds.has(entity.id)) continue;
      imageIds.add(material.baseColorTextureId);
      imageIds.add(material.metallicRoughnessTextureId);
      imageIds.add(material.normalTextureId);
      imageIds.add(material.occlusionTextureId);
      imageIds.add(material.emissiveTextureId);
      commands.despawnById(entity.id);
    }

    for (const entity of images) {
      if (!imageIds.has(entity.id)) continue;
      commands.despawnById(entity.id);
    }
  }

  events.clear();
}
