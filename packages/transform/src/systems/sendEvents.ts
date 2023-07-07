import {
  PointerCancelEvent,
  PointerDownEvent,
  pointerEventFromECS,
  PointerMoveEvent,
  PointerUpEvent,
} from "@lattice-engine/input";
import { EventReader, Res } from "thyseus";

import { TransformControlsStore } from "../resources";

export function sendEvents(
  store: Res<TransformControlsStore>,
  pointerDownReader: EventReader<PointerDownEvent>,
  pointerMoveReader: EventReader<PointerMoveEvent>,
  pointerCancelReader: EventReader<PointerCancelEvent>,
  pointerUpReader: EventReader<PointerUpEvent>
) {
  for (const data of pointerDownReader) {
    const event = pointerEventFromECS("pointerdown", data);
    store.mockElement.dispatchEvent(event);
  }

  for (const data of pointerMoveReader) {
    const event = pointerEventFromECS("pointermove", data);
    store.mockElement.dispatchEvent(event);
  }

  for (const data of pointerCancelReader) {
    const event = pointerEventFromECS("pointercancel", data);
    store.mockElement.dispatchEvent(event);
  }

  for (const data of pointerUpReader) {
    const event = pointerEventFromECS("pointerup", data);
    store.mockElement.dispatchEvent(event);
  }
}
