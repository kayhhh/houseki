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
  readonly loaded = new Map<string, number[]>();
}

export function fetchAssets(
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
      if (loaded !== resource.data) {
        resource.data = loaded;
      }
      continue;
    }

    commands.getById(entity.id).add(new Loading(`Fetching ${uri}`));

    fetch(uri)
      .then((response) => response.arrayBuffer())
      .then((data) => {
        const array = new Uint8Array(data);
        localStore.loaded.set(uri, Array.from(array));
      });
  }

  for (const [entity, resource] of loading) {
    if (!resource.uri) continue;

    const loaded = localStore.loaded.get(resource.uri);

    if (loaded) {
      resource.data = loaded;
      commands.getById(entity.id).remove(Loading);
    }
  }
}
