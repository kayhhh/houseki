import { Loading, Warehouse } from "@lattice-engine/core";
import { Image, ImageMimeType } from "@lattice-engine/scene";
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
   * Entity ID -> Fetched blob
   */
  readonly blobs = new Map<bigint, Blob>();

  /**
   * Entity ID -> fetch promise
   */
  readonly fetchPromises = new Map<bigint, Promise<void>>();

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
  entities: Query<[Entity, Image]>
) {
  const ids: bigint[] = [];

  for (const [entity, image] of entities) {
    ids.push(entity.id);

    // If the image is loaded, save it to the render store
    const bitmap = localStore.bitmaps.get(entity.id);
    if (bitmap) {
      renderStore.images.set(entity.id, bitmap);

      if (localStore.bitmapPromises.has(entity.id)) {
        localStore.bitmapPromises.delete(entity.id);
        if (entity.hasComponent(Loading)) entity.remove(Loading);
      }
    }

    // Load new images
    if (!localStore.processed.has(entity.id)) {
      // TODO: Add this back in (glitch breaking it?)
      // entity.add(new Loading(`Loading image ${entity.id}`));

      // Get the entity ID now
      // It cannot be accessed in the promise
      const entityId = entity.id;

      let blob: Blob;

      if (image.uri) {
        const promise = localStore.fetchPromises.get(entityId);

        if (!promise) {
          localStore.fetchPromises.set(
            entityId,
            fetch(image.uri)
              .then((response) => response.blob())
              .then((blob) => {
                localStore.blobs.set(entityId, blob);
              })
          );
          continue;
        } else {
          const fetchedBlob = localStore.blobs.get(entityId);
          if (!fetchedBlob) continue;

          localStore.fetchPromises.delete(entityId);
          localStore.blobs.delete(entityId);

          blob = fetchedBlob;
        }
      } else {
        const data = image.data.read(warehouse);
        if (!data?.length) continue;

        blob = new Blob([data], {
          type: ImageMimeType[image.mimeType],
        });
      }

      localStore.processed.add(entityId);

      localStore.bitmapPromises.set(
        entityId,
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
      const bitmapPromise = localStore.bitmapPromises.get(id);
      const fetchPromise = localStore.fetchPromises.get(id);

      if (bitmapPromise) {
        bitmapPromise.then(() => {
          localStore.bitmaps.delete(id);
        });
      }

      if (fetchPromise) {
        fetchPromise.then(() => {
          localStore.blobs.delete(id);
        });
      }

      localStore.bitmaps.delete(id);
      localStore.bitmapPromises.delete(id);
      localStore.processed.delete(id);
      renderStore.images.delete(id);
    }
  }
}
