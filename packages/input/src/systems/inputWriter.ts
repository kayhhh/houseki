import { CoreStore } from "@lattice-engine/core";
import { EventWriter, Mut, Res, SystemRes } from "thyseus";

import {
  ContextMenuEvent,
  KeyDownEvent,
  KeyUpEvent,
  OnWheelEvent,
  PointerCancelEvent,
  PointerDownEvent,
  PointerMoveEvent,
  PointerUpEvent,
} from "../events";
import { InputStruct } from "../resources";
import {
  keyboardEventToECS,
  mouseEventToECS,
  pointerEventToECS,
  wheelEventToECS,
} from "../utils";

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
  readonly keyUpEvents: KeyDownEvent[] = [];
}

/**
 * Reads input events from the canvas and writes them into the ECS.
 */
export function inputWriter(
  coreStore: Res<CoreStore>,
  inputStruct: Res<Mut<InputStruct>>,
  localStore: SystemRes<LocalStore>,
  pointerMoveWriter: EventWriter<PointerMoveEvent>,
  pointerDownWriter: EventWriter<PointerDownEvent>,
  pointerUpWriter: EventWriter<PointerUpEvent>,
  pointerCancelWriter: EventWriter<PointerCancelEvent>,
  contextMenuWriter: EventWriter<ContextMenuEvent>,
  onWheelWriter: EventWriter<OnWheelEvent>,
  keyDownWriter: EventWriter<KeyDownEvent>,
  keyUpWriter: EventWriter<KeyUpEvent>
) {
  // Clear events from last frame
  pointerMoveWriter.clear();
  pointerDownWriter.clear();
  pointerUpWriter.clear();
  pointerCancelWriter.clear();
  contextMenuWriter.clear();
  onWheelWriter.clear();
  keyDownWriter.clear();

  // Process queued events
  for (const event of localStore.pointerMoveEvents) {
    pointerMoveWriter.createFrom(event);
  }

  for (const event of localStore.pointerDownEvents) {
    inputStruct.isPointerDown = true;
    pointerDownWriter.createFrom(event);
  }

  for (const event of localStore.pointerUpEvents) {
    inputStruct.isPointerDown = false;
    pointerUpWriter.createFrom(event);
  }

  for (const event of localStore.pointerCancelEvents) {
    inputStruct.isPointerDown = false;
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

    // Update pressed keys
    inputStruct.keys[event.key] = 1;
  }

  for (const event of localStore.keyUpEvents) {
    keyUpWriter.createFrom(event);

    // Update pressed keys
    inputStruct.keys[event.key] = 0;
  }

  // Clear local queues
  localStore.pointerMoveEvents.length = 0;
  localStore.pointerDownEvents.length = 0;
  localStore.pointerUpEvents.length = 0;
  localStore.pointerCancelEvents.length = 0;
  localStore.contextMenuEvents.length = 0;
  localStore.onWheelEvents.length = 0;
  localStore.keyDownEvents.length = 0;
  localStore.keyUpEvents.length = 0;

  // If canvas hasn't changed, we're done
  const canvas = coreStore.canvas;
  if (localStore.canvas === canvas) return;

  // Remove old listeners
  if (localStore.removeEventListeners) localStore.removeEventListeners();

  // Set new canvas
  localStore.canvas = canvas;

  if (!canvas) return;

  // Add new listeners
  function onPointerDown(event: PointerEvent) {
    if (inputStruct.enablePointerLock) {
      if (document.pointerLockElement !== canvas) canvas?.requestPointerLock();
    } else {
      canvas?.setPointerCapture(event.pointerId);
    }

    localStore.pointerDownEvents.push(pointerEventToECS(event));
  }

  function onPointerMove(event: PointerEvent) {
    localStore.pointerMoveEvents.push(pointerEventToECS(event));
  }

  function onPointerCancel(event: PointerEvent) {
    canvas?.releasePointerCapture(event.pointerId);
    localStore.pointerCancelEvents.push(pointerEventToECS(event));
  }

  function onPointerUp(event: PointerEvent) {
    canvas?.releasePointerCapture(event.pointerId);
    localStore.pointerUpEvents.push(pointerEventToECS(event));
  }

  function onContextMenu(event: MouseEvent) {
    event.preventDefault();
    localStore.contextMenuEvents.push(mouseEventToECS(event));
  }

  function onWheel(event: WheelEvent) {
    localStore.onWheelEvents.push(wheelEventToECS(event));
  }

  function onKeyDown(event: KeyboardEvent) {
    localStore.keyDownEvents.push(keyboardEventToECS(event));
  }

  function onKeyUp(event: KeyboardEvent) {
    localStore.keyUpEvents.push(keyboardEventToECS(event));
  }

  function onPointerLockChange() {
    inputStruct.isPointerLocked = document.pointerLockElement === canvas;
  }

  // Set initial pointer lock state
  inputStruct.isPointerLocked = document.pointerLockElement === canvas;

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointercancel", onPointerCancel);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("contextmenu", onContextMenu);
  canvas.addEventListener("wheel", onWheel);
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);
  document.addEventListener("pointerlockchange", onPointerLockChange);

  // Set remove listeners function
  localStore.removeEventListeners = () => {
    canvas.removeEventListener("pointerdown", onPointerDown);
    canvas.removeEventListener("pointermove", onPointerMove);
    canvas.removeEventListener("pointercancel", onPointerCancel);
    canvas.removeEventListener("pointerup", onPointerUp);
    canvas.removeEventListener("contextmenu", onContextMenu);
    canvas.removeEventListener("wheel", onWheel);
    document.removeEventListener("keydown", onKeyDown);
    document.removeEventListener("keyup", onKeyUp);
    document.removeEventListener("pointerlockchange", onPointerLockChange);
  };
}
