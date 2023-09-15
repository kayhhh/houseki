import { Entity, Mut, Query, Res } from "thyseus";

import { TransformControls } from "../components";
import { TransformControlsStore } from "../resources";

export function saveDragging(
  store: Res<TransformControlsStore>,
  transformControls: Query<[Entity, Mut<TransformControls>]>
) {
  for (const [entity, controls] of transformControls) {
    const object = store.objects.get(entity.id);

    if (object) {
      controls.dragging = object.dragging;
    } else {
      controls.dragging = false;
    }
  }
}
