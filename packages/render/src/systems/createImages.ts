import { Asset, Warehouse } from "@houseki-engine/core";
import { Image } from "@houseki-engine/scene";
import { Entity, Mut, Query, Res, SystemRes } from "thyseus";

import { RenderStore } from "../resources";

class LocalStore {
  /**
   * Entity ID -> ImageBitmap
   */
  readonly bitmaps = new Map<bigint, ImageBitmap>();

  /**
   * Entity ID -> data used to create the ImageBitmap
   */
  readonly loadedData = new Map<bigint, Uint8Array>();
}

/**
 * Creates ImageBitmaps.
 */
export function createImages(
  warehouse: Res<Warehouse>,
  renderStore: Res<Mut<RenderStore>>,
  localStore: SystemRes<LocalStore>,
  entities: Query<[Entity, Asset, Image]>
) {
  const ids: bigint[] = [];

  localStore.bitmaps.forEach((bitmap, id) => {
    renderStore.images.set(id, bitmap);
  });

  for (const [entity, asset, image] of entities) {
    ids.push(entity.id);

    // If already created, skip
    if (localStore.bitmaps.has(entity.id)) continue;

    const array = asset.data.read(warehouse);

    // If data is empty, remove the bitmap
    if (!array) {
      localStore.bitmaps.delete(entity.id);
      localStore.loadedData.delete(entity.id);
      renderStore.images.delete(entity.id);
      continue;
    }

    // If data hasn't changed, skip
    const loaded = localStore.loadedData.get(entity.id);
    if (loaded && loaded === array) continue;

    // Create the bitmap
    localStore.loadedData.set(entity.id, array);

    const blob = new Blob([array], { type: asset.mimeType });
    const entityId = entity.id;
    const imageOrientation: ImageOrientation = image.flipY ? "flipY" : "none";

    createImageBitmap(blob, { imageOrientation }).then((bitmap) => {
      localStore.bitmaps.set(entityId, bitmap);
    });
  }

  // Remove bitmaps that are no longer needed
  for (const id of localStore.bitmaps.keys()) {
    if (!ids.includes(id)) {
      localStore.bitmaps.delete(id);
      localStore.loadedData.delete(id);
      renderStore.images.delete(id);
    }
  }
}
