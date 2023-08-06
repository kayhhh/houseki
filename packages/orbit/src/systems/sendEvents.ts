import {
  ContextMenuEvent,
  keyboardEventFromECS,
  KeyDownEvent,
  mouseEventFromECS,
  OnWheelEvent,
  PointerCancelEvent,
  PointerDownEvent,
  pointerEventFromECS,
  PointerMoveEvent,
  PointerUpEvent,
  wheelEventFromECS,
} from "@lattice-engine/input";
import { EventReader, Res } from "thyseus";

import { OrbitControlsStore } from "../resources";

export function sendEvents(
  store: Res<OrbitControlsStore>,
  pointerDownReader: EventReader<PointerDownEvent>,
  pointerMoveReader: EventReader<PointerMoveEvent>,
  pointerCancelReader: EventReader<PointerCancelEvent>,
  pointerUpReader: EventReader<PointerUpEvent>,
  contextMenuReader: EventReader<ContextMenuEvent>,
  onWheelReader: EventReader<OnWheelEvent>,
  keyDownReader: EventReader<KeyDownEvent>,
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

  for (const data of contextMenuReader) {
    const event = mouseEventFromECS("contextmenu", data);
    store.mockElement.dispatchEvent(event);
  }

  for (const data of onWheelReader) {
    const event = wheelEventFromECS("wheel", data);
    store.mockElement.dispatchEvent(event);
  }

  for (const data of keyDownReader) {
    const event = keyboardEventFromECS("keydown", data);
    store.mockElement.dispatchEvent(event);
  }
}
