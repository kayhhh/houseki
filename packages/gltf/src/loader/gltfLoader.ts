import { Document, WebIO } from "@gltf-transform/core";
import { defineSystem, Entity } from "thyseus";

import { GltfLoaded, GltfUri } from "../components";
import { extensions } from "../extensions";
import { loadDoc } from "./loadDoc";

class DocStore {
  /**
   * Entity ID -> glTF Document
   */
  readonly docs = new Map<bigint, Document>();
}

/**
 * Loads glTFs into the DocStore.
 */
export const gltfLoader = defineSystem(
  ({ Query, Without, Res }) => [
    Res(DocStore),
    Query([GltfUri, Entity], Without(GltfLoaded)),
  ],
  (store, entities) => {
    // Load glTFs
    for (const [gltf, entity] of entities) {
      if (!gltf.uri) continue;

      // Mark as loaded
      entity.addType(GltfLoaded);

      const id = entity.id;

      // Load uri
      const io = new WebIO().registerExtensions(extensions);
      io.read(gltf.uri.read()).then((doc) => store.docs.set(id, doc));
    }
  }
);

/**
 * Loads documents from the DocStore into the ECS.
 */
export const gltfDocumentLoader = defineSystem(
  ({ Query, With, Commands, Res }) => [
    Res(DocStore),
    Commands(),
    Query(Entity, With(GltfLoaded)),
  ],
  (store, commands, entities) => {
    // Load documents
    for (const entity of entities) {
      // Ignore if document has not been loaded yet,
      // Or has already been loaded into the ECS
      const doc = store.docs.get(entity.id);
      if (!doc) continue;

      // Remove from store
      store.docs.delete(entity.id);

      // Load document
      loadDoc(doc, entity, commands);
    }
  }
);
