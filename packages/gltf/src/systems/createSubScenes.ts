import { Parent } from "@houseki-engine/scene";
import { Entity, Mut, Query } from "thyseus";

import { SubScene } from "../components";

export function createSubScenes(
  subScenes: Query<[Entity, SubScene]>,
  nodes: Query<[Entity, Mut<Parent>]>
) {
  // Parent nodes
  for (const [entity, subScene] of subScenes) {
    for (const nodeId of subScene.nodes) {
      for (const [nodeEnt, parent] of nodes) {
        if (nodeEnt.id === nodeId) {
          parent.id = entity.id;
        }
      }
    }
  }
}
