import { Commands, Entity, Query, With, Without } from "thyseus";

import { TargetTransform } from "../../dist";
import { PrevTargetTransform } from "../components";

export function addPrevTransform(
  commands: Commands,
  entities: Query<Entity, [With<TargetTransform>, Without<PrevTargetTransform>]>
) {
  for (const ent of entities) {
    commands.get(ent).addType(PrevTargetTransform);
  }
}
