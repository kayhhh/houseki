import {
  Commands,
  Entity,
  Mut,
  Query,
  Res,
  SystemRes,
  With,
  Without,
} from "thyseus";

import { Asset, Loading } from "../components";
import { Warehouse } from "../Warehouse";

class LocalStore {
  /**
   * Entity ID -> URI
   */
  readonly loaded = new Map<string, Uint8Array>();
}

export function fetchAssets(
  warehouse: Res<Mut<Warehouse>>,
  commands: Commands,
  localStore: SystemRes<LocalStore>,
  toLoad: Query<[Entity, Mut<Asset>], Without<Loading>>,
  loading: Query<[Entity, Mut<Asset>], With<Loading>>
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

    commands.get(entity).add(new Loading(`Fetching ${uri}`));

    fetch(uri)
      .then((response) => response.arrayBuffer())
      .then((data) => {
        const array = new Uint8Array(data);
        localStore.loaded.set(uri, array);
      });
  }

  for (const [entity, resource] of loading) {
    if (!resource.uri) continue;

    const loaded = localStore.loaded.get(resource.uri);

    if (loaded) {
      resource.data.write(loaded, warehouse);
      commands.get(entity).remove(Loading);
    }
  }
}
