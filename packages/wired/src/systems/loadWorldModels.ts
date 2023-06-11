import { Asset, Warehouse } from "@lattice-engine/core";
import { Gltf } from "@lattice-engine/gltf";
import { WorldMetadataSchema } from "@wired-protocol/types";
import {
  dropStruct,
  Entity,
  Query,
  Res,
  SystemRes,
  With,
  Without,
} from "thyseus";

import { WorldJson } from "../components";

class LocalStore {
  readonly processed = new Set<bigint>();
}

const decoder = new TextDecoder();

export function loadWorldModels(
  warehouse: Res<Warehouse>,
  localStore: SystemRes<LocalStore>,
  worlds: Query<[Entity, Asset], [With<WorldJson>, Without<Gltf>]>
) {
  const ids: bigint[] = [];

  for (const [entity, asset] of worlds) {
    ids.push(entity.id);

    const buffer = asset.data.read(warehouse);
    if (!buffer || buffer.byteLength === 0) continue;

    if (localStore.processed.has(entity.id)) continue;
    localStore.processed.add(entity.id);

    const json = decoder.decode(buffer);
    const parsed = WorldMetadataSchema.safeParse(JSON.parse(json));

    if (!parsed.success) {
      console.warn(
        `Failed to parse world metadata ${asset.uri}:`,
        parsed.error
      );
      continue;
    }

    const gltf = new Gltf(parsed.data.model);
    entity.add(gltf);
    dropStruct(gltf);
  }

  // Remove removed worlds
  for (const id of localStore.processed) {
    if (!ids.includes(id)) {
      localStore.processed.delete(id);
    }
  }
}
