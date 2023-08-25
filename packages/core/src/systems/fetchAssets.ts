import {
  Commands,
  dropStruct,
  Entity,
  Mut,
  Query,
  Res,
  SystemRes,
  With,
  Without,
} from "thyseus";

import { Asset, Loading } from "../components";
import { Warehouse } from "../warehouse";

class LocalStore {
  readonly loaded = new Map<string, ArrayBuffer>();
}

export function fetchAssets(
  commands: Commands,
  warehouse: Res<Mut<Warehouse>>,
  localStore: SystemRes<LocalStore>,
  toLoad: Query<[Entity, Asset], Without<Loading>>,
  loading: Query<[Entity, Asset], With<Loading>>
) {
  for (const [entity, resource] of toLoad) {
    const uri = resource.uri.read(warehouse);
    if (!uri) continue;

    const loaded = localStore.loaded.get(uri);

    if (loaded) {
      if (loaded !== resource.data.read(warehouse)) {
        resource.data.write(loaded, warehouse);
      }
      continue;
    }

    const loadMessage = new Loading();
    loadMessage.message.write(`Fetching ${uri}`, warehouse);

    commands.getById(entity.id).add(loadMessage);
    dropStruct(loadMessage);

    fetch(uri)
      .then((response) => response.arrayBuffer())
      .then((data) => localStore.loaded.set(uri, data));
  }

  for (const [entity, resource] of loading) {
    const uri = resource.uri.read(warehouse) ?? "";
    const loaded = localStore.loaded.get(uri);

    if (loaded) {
      resource.data.write(loaded, warehouse);
      commands.getById(entity.id).remove(Loading);
    }
  }
}
