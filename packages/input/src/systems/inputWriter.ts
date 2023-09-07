import { CoreStore } from "@houseki-engine/core";
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
  keyToECS,
  mouseEventToECS,
  pointerEventToECS,
  wheelEventToECS,
} from "../utils";

class LocalStore {
  canvas: HTMLCanvasElement | null = null;
  removeEventListeners: (() => void) | null = null;

  isPointerDown = false;
  isPointerLocked = false;

  keyPressed = new Set<number>();

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
    pointerMoveWriter.create(event);
  }

  for (const event of localStore.pointerDownEvents) {
    pointerDownWriter.create(event);
  }

  for (const event of localStore.pointerUpEvents) {
    pointerUpWriter.create(event);
  }

  for (const event of localStore.pointerCancelEvents) {
    pointerCancelWriter.create(event);
  }

  for (const event of localStore.contextMenuEvents) {
    contextMenuWriter.create(event);
  }

  for (const event of localStore.onWheelEvents) {
    onWheelWriter.create(event);
  }

  for (const event of localStore.keyDownEvents) {
    keyDownWriter.create(event);
  }

  for (const event of localStore.keyUpEvents) {
    keyUpWriter.create(event);
  }

  inputStruct.isPointerDown = localStore.isPointerDown;
  inputStruct.isPointerLocked = localStore.isPointerLocked;

  inputStruct.keys = 0n;

  for (const key of localStore.keyPressed) {
    inputStruct.setKeyPressed(key);
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

  const canvas = coreStore.canvas;

  // If canvas changes, update listeners
  if (localStore.canvas !== canvas) {
    // Remove old listeners
    if (localStore.removeEventListeners) {
      localStore.removeEventListeners();
    }

    // Set new canvas
    localStore.canvas = canvas;

    if (canvas) {
      // Add new listeners
      const onPointerDown = (event: PointerEvent) => {
        localStore.isPointerDown = true;

        if (inputStruct.enablePointerLock) {
          if (document.pointerLockElement !== canvas) {
            canvas?.requestPointerLock();
          }
        } else {
          canvas?.setPointerCapture(event.pointerId);
        }

        localStore.pointerDownEvents.push(pointerEventToECS(event));
      };

      const onPointerMove = (event: PointerEvent) => {
        localStore.pointerMoveEvents.push(pointerEventToECS(event));
      };

      const onPointerCancel = (event: PointerEvent) => {
        canvas?.releasePointerCapture(event.pointerId);
        localStore.isPointerDown = false;
        localStore.pointerCancelEvents.push(pointerEventToECS(event));
      };

      const onPointerUp = (event: PointerEvent) => {
        canvas?.releasePointerCapture(event.pointerId);
        localStore.isPointerDown = false;
        localStore.pointerUpEvents.push(pointerEventToECS(event));
      };

      const onContextMenu = (event: MouseEvent) => {
        event.preventDefault();
        localStore.contextMenuEvents.push(mouseEventToECS(event));
      };

      const onWheel = (event: WheelEvent) => {
        localStore.onWheelEvents.push(wheelEventToECS(event));
      };

      const onKeyDown = (event: KeyboardEvent) => {
        localStore.keyPressed.add(keyToECS(event.key));
        localStore.keyDownEvents.push(keyboardEventToECS(event));
      };

      const onKeyUp = (event: KeyboardEvent) => {
        localStore.keyPressed.delete(keyToECS(event.key));
        localStore.keyUpEvents.push(keyboardEventToECS(event));
      };

      const onPointerLockChange = () => {
        localStore.isPointerLocked = document.pointerLockElement === canvas;
      };

      // Set initial pointer lock state
      localStore.isPointerLocked = document.pointerLockElement === canvas;

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
  }
}
