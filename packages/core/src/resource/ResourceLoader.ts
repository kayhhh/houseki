import { Entity, System, system } from "@lastolivegames/becsy";

import { ResourceData, ResourcePointer, ResourceUri } from "./components";

/**
 * Fetches and loads resources into the ECS.
 */
@system
export class Loader extends System {
  readonly #resourcesToLoad = this.query(
    (q) => q.addedOrChanged.with(ResourceUri).without(ResourcePointer).write
  );

  readonly #removedUris = this.query((q) => q.removed.with(ResourceUri));

  readonly #removedPointers = this.query((q) =>
    q.removed.with(ResourcePointer)
  );

  /**
   * A map of resource URIs -> ResourceData entities
   */
  uriToData = new Map<string, Promise<Entity>>();

  override execute() {
    // Load resource URIs
    for (const entity of this.#resourcesToLoad.addedOrChanged) {
      const uri = entity.read(ResourceUri).uri;

      // Start loading ResourceData if the URI hasn't been loaded yet
      if (!this.uriToData.has(uri)) {
        this.uriToData.set(
          uri,
          fetch(uri)
            .then((response) => response.arrayBuffer())
            .then((data) => this.createEntity(ResourceData, { data }).hold())
        );
      }

      // Set ResourcePointer to the ResourceData entity once it's loaded
      this.uriToData.get(uri)?.then((dataEntity) => {
        if (entity.has(ResourcePointer)) {
          entity.write(ResourcePointer).data = dataEntity;
        } else {
          entity.add(ResourcePointer, { data: dataEntity });
        }
      });
    }

    // Remove ResourcePointer when ResourceUri is removed
    for (const entity of this.#removedUris.removed) {
      if (entity.has(ResourcePointer)) entity.remove(ResourcePointer);
    }

    // Remove ResourceData entities that no longer have pointers
    for (const entity of this.#removedPointers.removed) {
      const data = entity.read(ResourcePointer).data;

      if (data.read(ResourceData).pointers.length === 0) {
        const uri = data.read(ResourceUri).uri;
        this.uriToData.delete(uri);

        data.delete();
      }
    }
  }
}
