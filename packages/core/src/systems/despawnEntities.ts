import { Entity, Query } from "thyseus";

export function despawnEntities(entities: Query<Entity>) {
  for (const entity of entities) {
    entity.despawn();
  }
}
