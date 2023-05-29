import { Warehouse } from "@lattice-engine/core";
import { ImageMimeType, Texture } from "@lattice-engine/scene";
import { Entity, Query, Res, SystemRes } from "thyseus";

import { RenderStore } from "../resources";

class LocalStore {
  /**
   * Entity ID -> ImageBitmap
   */
  readonly bitmaps = new Map<bigint, ImageBitmap>();

  /**
   * Entity ID -> createImageBitmap promise
   */
  readonly bitmapPromises = new Map<bigint, Promise<void>>();

  /**
   * Entity IDs that have been processed.
   */
  readonly processed = new Set<bigint>();
}

/**
 * Creates ImageBitmaps.
 */
export function createImages(
  warehouse: Res<Warehouse>,
  renderStore: Res<RenderStore>,
  localStore: SystemRes<LocalStore>,
  entities: Query<[Entity, Texture]>
) {
  const ids: bigint[] = [];

  for (const [entity, texture] of entities) {
    ids.push(entity.id);

    // If the image is loaded, save it to the render store
    const bitmap = localStore.bitmaps.get(entity.id);
    if (bitmap) renderStore.images.set(entity.id, bitmap);

    // Load new images
    if (!localStore.processed.has(entity.id)) {
      // Mark the image as processed
      localStore.processed.add(entity.id);

      const blob = new Blob([texture.image.read(warehouse)], {
        type: ImageMimeType[texture.mimeType],
      });

      // Get the entity ID now
      // It cannot be accessed in the promise
      const entityId = entity.id;

      localStore.bitmapPromises.set(
        entity.id,
        createImageBitmap(blob).then((bitmap) => {
          localStore.bitmaps.set(entityId, bitmap);
        })
      );
    }
  }

  // Remove images that no longer exist
  for (const id of renderStore.images.keys()) {
    if (!ids.includes(id)) {
      // If the image is still loading, delete when it's done
      const promise = localStore.bitmapPromises.get(id);
      if (promise) {
        promise.then(() => {
          localStore.bitmaps.delete(id);
        });
      }

      localStore.bitmaps.delete(id);
      localStore.bitmapPromises.delete(id);
      localStore.processed.delete(id);
      renderStore.images.delete(id);
    }
  }
}
