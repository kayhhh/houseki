import { Parent } from "@houseki-engine/scene";
import { Entity, Mut, Query, With } from "thyseus";

import { SceneView, SubScene } from "../components";

export function switchSceneView(
  views: Query<[Entity, SceneView]>,
  subScenes: Query<[Entity, Mut<Parent>], With<SubScene>>
) {
  for (const [entity, view] of views) {
    for (const [sceneEnt, parent] of subScenes) {
      if (!view.scenes.includes(sceneEnt.id)) return;

      if (view.active === sceneEnt.id) {
        parent.id = entity.id;
      } else {
        parent.id = 0n;
      }
    }
  }
}
