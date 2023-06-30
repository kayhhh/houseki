import { Commands, Entity, Query } from "thyseus";

export function despawnEntities(commands: Commands, entities: Query<Entity>) {
  for (const entity of entities) {
    commands.despawnById(entity.id);
  }
}
