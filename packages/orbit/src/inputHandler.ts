import {
  keyboardEventToECS,
  mouseEventToECS,
  pointerEventToECS,
  wheelEventToECS,
} from "@lattice-engine/core";
import { RenderStore } from "@lattice-engine/render";
import {
  EventWriter,
  EventWriterDescriptor,
  Res,
  ResourceDescriptor,
  SystemRes,
  SystemResourceDescriptor,
} from "thyseus";

import {
  ContextMenuEvent,
  KeyDownEvent,
  OnWheelEvent,
  PointerCancelEvent,
  PointerDownEvent,
  PointerMoveEvent,
  PointerUpEvent,
} from "./events";

class LocalStore {
  canvas: HTMLCanvasElement | null = null;
  removeEventListeners: (() => void) | null = null;

  // Store events in a queue so we can process them in the next frame
  readonly pointerMoveEvents: PointerMoveEvent[] = [];
  readonly pointerDownEvents: PointerDownEvent[] = [];
  readonly pointerUpEvents: PointerUpEvent[] = [];
  readonly pointerCancelEvents: PointerCancelEvent[] = [];
  readonly contextMenuEvents: ContextMenuEvent[] = [];
  readonly onWheelEvents: OnWheelEvent[] = [];
  readonly keyDownEvents: KeyDownEvent[] = [];
}

/**
 * Reads input events from the canvas and sends them into the ECS.
 */
export function inputHandler(
  store: Res<RenderStore>,
  localStore: SystemRes<LocalStore>,
  pointerMoveWriter: EventWriter<PointerMoveEvent>,
  pointerDownWriter: EventWriter<PointerDownEvent>,
  pointerUpWriter: EventWriter<PointerUpEvent>,
  pointerCancelWriter: EventWriter<PointerCancelEvent>,
  contextMenuWriter: EventWriter<ContextMenuEvent>,
  onWheelWriter: EventWriter<OnWheelEvent>,
  keyDownWriter: EventWriter<KeyDownEvent>
) {
  // Process queued events
  for (const event of localStore.pointerMoveEvents) {
    pointerMoveWriter.createFrom(event);
  }

  for (const event of localStore.pointerDownEvents) {
    pointerDownWriter.createFrom(event);
  }

  for (const event of localStore.pointerUpEvents) {
    pointerUpWriter.createFrom(event);
  }

  for (const event of localStore.pointerCancelEvents) {
    pointerCancelWriter.createFrom(event);
  }

  for (const event of localStore.contextMenuEvents) {
    contextMenuWriter.createFrom(event);
  }

  for (const event of localStore.onWheelEvents) {
    onWheelWriter.createFrom(event);
  }

  for (const event of localStore.keyDownEvents) {
    keyDownWriter.createFrom(event);
  }

  // Clear queues
  localStore.pointerMoveEvents.length = 0;
  localStore.pointerDownEvents.length = 0;
  localStore.pointerUpEvents.length = 0;
  localStore.pointerCancelEvents.length = 0;
  localStore.contextMenuEvents.length = 0;
  localStore.onWheelEvents.length = 0;
  localStore.keyDownEvents.length = 0;

  // If canvas hasn't changed, we're done
  const canvas = store.renderer.domElement;
  if (localStore.canvas === canvas) return;

  // Remove old listeners
  if (localStore.removeEventListeners) localStore.removeEventListeners();

  // Set new canvas
  localStore.canvas = canvas;

  // Add new listeners
  function onPointerMove(event: PointerEvent) {
    localStore.pointerMoveEvents.push(pointerEventToECS(event));
  }

  function onPointerUp(event: PointerEvent) {
    canvas.releasePointerCapture(event.pointerId);
    localStore.pointerUpEvents.push(pointerEventToECS(event));
  }

  function onPointerDown(event: PointerEvent) {
    canvas.focus();
    canvas.setPointerCapture(event.pointerId);
    localStore.pointerDownEvents.push(pointerEventToECS(event));
  }

  function onPointerCancel(event: PointerEvent) {
    localStore.pointerCancelEvents.push(pointerEventToECS(event));
  }

  function onContextMenu(event: MouseEvent) {
    event.preventDefault();
    localStore.contextMenuEvents.push(mouseEventToECS(event));
  }

  function onWheel(event: WheelEvent) {
    localStore.onWheelEvents.push(wheelEventToECS(event));
  }

  function onKeyDown(event: KeyboardEvent) {
    console.log("😠", event);
    localStore.keyDownEvents.push(keyboardEventToECS(event));
  }

  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointercancel", onPointerCancel);
  canvas.addEventListener("contextmenu", onContextMenu);
  canvas.addEventListener("wheel", onWheel);
  canvas.addEventListener("keydown", onKeyDown);

  // Set remove listeners function
  localStore.removeEventListeners = () => {
    canvas.removeEventListener("pointermove", onPointerMove);
    canvas.removeEventListener("pointerup", onPointerUp);
    canvas.removeEventListener("pointerdown", onPointerDown);
    canvas.removeEventListener("pointercancel", onPointerCancel);
    canvas.removeEventListener("contextmenu", onContextMenu);
    canvas.removeEventListener("wheel", onWheel);
    canvas.removeEventListener("keydown", onKeyDown);
  };
}

inputHandler.parameters = [
  ResourceDescriptor(RenderStore),
  SystemResourceDescriptor(LocalStore),
  EventWriterDescriptor(PointerMoveEvent),
  EventWriterDescriptor(PointerDownEvent),
  EventWriterDescriptor(PointerUpEvent),
  EventWriterDescriptor(PointerCancelEvent),
  EventWriterDescriptor(ContextMenuEvent),
  EventWriterDescriptor(OnWheelEvent),
  EventWriterDescriptor(KeyDownEvent),
];
