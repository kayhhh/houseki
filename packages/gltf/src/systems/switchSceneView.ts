import { Parent, Scene, SceneView } from "@houseki-engine/scene";
import { Entity, Mut, Query, With } from "thyseus";

export function switchSceneView(
  views: Query<[Entity, SceneView]>,
  scenes: Query<[Entity, Mut<Parent>], With<Scene>>
) {
  for (const [entity, view] of views) {
    for (const [sceneEnt, parent] of scenes) {
      if (!view.scenes.includes(sceneEnt.id)) continue;

      if (view.active === sceneEnt.id) {
        parent.id = entity.id;
      } else {
        parent.id = 0n;
      }
    }
  }
}
