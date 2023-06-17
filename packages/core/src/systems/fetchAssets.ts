import {
  dropStruct,
  Entity,
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
  warehouse: Res<Warehouse>,
  localStore: SystemRes<LocalStore>,
  toLoad: Query<[Entity, Asset], Without<Loading>>,
  loading: Query<[Entity, Asset], With<Loading>>
) {
  for (const [entity, resource] of toLoad) {
    const uri = resource.uri;
    if (!uri) continue;

    const loaded = localStore.loaded.get(uri);
    if (loaded) {
      if (loaded !== resource.data.read(warehouse)) {
        resource.data.write(loaded, warehouse);
      }

      continue;
    }

    const loadMessage = new Loading(`Fetching ${uri}`);
    entity.add(loadMessage);
    dropStruct(loadMessage);

    fetch(uri)
      .then((response) => response.arrayBuffer())
      .then((data) => localStore.loaded.set(uri, data));
  }

  for (const [entity, resource] of loading) {
    const loaded = localStore.loaded.get(resource.uri);
    if (loaded) {
      resource.data.write(loaded, warehouse);
      entity.remove(Loading);
    }
  }
}
