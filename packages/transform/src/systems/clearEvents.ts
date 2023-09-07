import { PointerDownEvent, PointerMoveEvent } from "@houseki-engine/input";
import { Entity, EventWriter, Query, Res } from "thyseus";

import { TransformControls } from "../components";
import { TransformControlsStore } from "../resources";

export function clearEvents(
  store: Res<TransformControlsStore>,
  pointerDown: EventWriter<PointerDownEvent>,
  pointerMove: EventWriter<PointerMoveEvent>,
  transformControls: Query<[Entity, TransformControls]>
) {
  for (const [entity, controls] of transformControls) {
    if (!controls.clearEvents) continue;

    const object = store.objects.get(entity.id);

    if (object?.dragging) {
      pointerDown.clearImmediate();
      pointerMove.clearImmediate();
    }
  }
}
