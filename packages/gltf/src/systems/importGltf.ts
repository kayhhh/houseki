import { Document, WebIO } from "@gltf-transform/core";
import { Loading, Warehouse } from "@houseki-engine/core";
import { SceneView } from "@houseki-engine/scene";
import { Commands, Entity, Mut, Query, Res, SystemRes, With } from "thyseus";

import { Gltf, GltfInfo } from "../components";
import { extensions } from "../extensions/extensions";
import { ImportContext } from "../import/context";
import { importDoc } from "../import/importDoc";
import { removeGltf } from "../import/removeGltf";

const io = new WebIO().registerExtensions(extensions);

declare const DracoDecoderModule: undefined | (() => Promise<any>);

if (typeof DracoDecoderModule !== "undefined") {
  io.registerDependencies({ "draco3d.decoder": await DracoDecoderModule() });
}

class GltfStore {
  /**
   * All entity IDs that have a Gltf component.
   */
  ids: bigint[] = [];

  /**
   * Entity ID -> loaded URI
   */
  readonly uris = new Map<bigint, string>();

  /**
   * Entity ID -> glTF Document
   */
  readonly docs = new Map<bigint, Document>();

  /**
   * Entity ID -> glTF Context
   */
  readonly contexts = new Map<bigint, ImportContext>();
}

export function importGltf(
  warehouse: Res<Mut<Warehouse>>,
  commands: Commands,
  store: SystemRes<GltfStore>,
  gltfs: Query<[Entity, Gltf]>,
  withView: Query<Entity, With<Gltf, SceneView>>,
  withInfo: Query<Entity, With<Gltf, GltfInfo>>
) {
  const ids: bigint[] = [];

  for (const [entity, gltf] of gltfs) {
    // If no uri, ignore
    if (!gltf.uri) continue;

    const id = entity.id;
    ids.push(id);

    const doc = store.docs.get(id);

    // If URI has changed, load new document
    if (store.uris.get(id) !== gltf.uri) {
      store.uris.set(id, gltf.uri);

      commands.get(entity).add(new Loading(`Loading ${gltf.uri}`));

      for (const ent of withView) {
        if (ent.id !== id) continue;
        commands.get(ent).remove(SceneView);
      }

      for (const ent of withInfo) {
        if (ent.id !== id) continue;
        commands.get(ent).remove(GltfInfo);
      }

      // Start loading document
      io.read(gltf.uri).then((doc) => store.docs.set(id, doc));
    } else if (doc) {
      // Remove old glTF entities
      const oldContext = store.contexts.get(id);
      if (oldContext) {
        store.contexts.delete(id);
        removeGltf(oldContext, commands);
      }

      // Load document into the ECS
      const context = importDoc(warehouse, doc, entity, commands);

      // Add context to store, for cleanup
      if (context) {
        store.contexts.set(id, context);
      }

      // Remove document from store
      store.docs.delete(id);

      // Remove loading component
      commands.get(entity).remove(Loading);
    }
  }

  // Clean up removed entities
  for (const id of store.ids) {
    if (!ids.includes(id)) {
      const context = store.contexts.get(id);
      if (context) {
        store.contexts.delete(id);
        removeGltf(context, commands);
      }

      store.uris.delete(id);
      store.docs.delete(id);
    }
  }
}
