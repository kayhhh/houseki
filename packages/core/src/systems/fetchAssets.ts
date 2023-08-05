import {
  Commands,
  Entity,
  Mut,
  Query,
  SystemRes,
  With,
  Without,
} from "thyseus";

import { Asset, Loading } from "../components";

class LocalStore {
  /**
   * Entity ID -> URI
   */
  readonly loaded = new Map<bigint, string>();

  /**
   * URI -> Data
   */
  readonly fetched = new Map<string, Uint8Array>();
}

export function fetchAssets(
  commands: Commands,
  localStore: SystemRes<LocalStore>,
  toLoad: Query<[Entity, Mut<Asset>], Without<Loading>>,
  loading: Query<[Entity, Asset], With<Loading>>
) {
  for (const [entity, resource] of toLoad) {
    const uri = resource.uri;

    const loaded = localStore.loaded.get(entity.id);

    if (uri === loaded) {
      continue;
    }

    const data = localStore.fetched.get(uri);

    if (data) {
      resource.data = Array.from(data);
      localStore.loaded.set(entity.id, uri);
      continue;
    }

    if (!uri) {
      localStore.fetched.set(uri, new Uint8Array());
      continue;
    }

    commands.getById(entity.id).add(new Loading(`Fetching ${uri}`));

    fetch(uri)
      .then((response) => response.arrayBuffer())
      .then((data) => localStore.fetched.set(uri, new Uint8Array(data)));
  }

  for (const [entity, resource] of loading) {
    const loaded = localStore.fetched.get(resource.uri);
    if (loaded) {
      commands.getById(entity.id).remove(Loading);
    }
  }
}
