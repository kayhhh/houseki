import {
  KeyboardEvent as LatticeKeyboardEvent,
  MouseEvent as LatticeMouseEvent,
  PointerEvent as LatticePointerEvent,
  WheelEvent as LatticeWheelEvent,
} from "./events";
import { Key, PointerType } from "./types";

export function pointerEventToECS(event: PointerEvent): LatticePointerEvent {
  const data = new LatticePointerEvent();

  data.altKey = event.altKey;
  data.button = event.button;
  data.buttons = event.buttons;
  data.clientX = event.clientX;
  data.clientY = event.clientY;
  data.ctrlKey = event.ctrlKey;
  data.height = event.height;

  data.isPrimary = event.isPrimary;
  data.metaKey = event.metaKey;
  data.movementX = event.movementX;
  data.movementY = event.movementY;
  data.pointerId = event.pointerId;
  data.pointerType = PointerType[event.pointerType as keyof typeof PointerType];
  data.pressure = event.pressure;
  data.screenX = event.screenX;
  data.screenY = event.screenY;
  data.shiftKey = event.shiftKey;
  data.tangentialPressure = event.tangentialPressure;
  data.tiltX = event.tiltX;
  data.tiltY = event.tiltY;
  data.twist = event.twist;
  data.width = event.width;

  return data;
}

export type PointerEventType =
  | "pointerdown"
  | "pointermove"
  | "pointerup"
  | "pointercancel"
  | "pointerenter"
  | "pointerleave"
  | "gotpointercapture"
  | "lostpointercapture";

export function pointerEventFromECS(
  type: PointerEventType,
  event: LatticePointerEvent
): PointerEvent {
  return new PointerEvent(type, {
    altKey: event.altKey,
    button: event.button,
    buttons: event.buttons,
    clientX: event.clientX,
    clientY: event.clientY,
    ctrlKey: event.ctrlKey,
    height: event.height,
    isPrimary: event.isPrimary,
    metaKey: event.metaKey,
    movementX: event.movementX,
    movementY: event.movementY,

    pointerId: event.pointerId,
    pointerType: PointerType[event.pointerType],
    pressure: event.pressure,
    tangentialPressure: event.tangentialPressure,
    tiltX: event.tiltX,
    tiltY: event.tiltY,
    twist: event.twist,
    width: event.width,
  });
}

export function mouseEventToECS(event: MouseEvent): LatticeMouseEvent {
  const data = new LatticeMouseEvent();

  data.altKey = event.altKey;
  data.button = event.button;
  data.buttons = event.buttons;
  data.clientX = event.clientX;
  data.clientY = event.clientY;
  data.ctrlKey = event.ctrlKey;
  data.metaKey = event.metaKey;
  data.movementX = event.movementX;
  data.movementY = event.movementY;
  data.screenX = event.screenX;
  data.screenY = event.screenY;
  data.shiftKey = event.shiftKey;

  return data;
}

export type MouseEventType = "click" | "contextmenu" | "dblclick";

export function mouseEventFromECS(
  type: MouseEventType,
  event: LatticeMouseEvent
): MouseEvent {
  return new MouseEvent(type, {
    altKey: event.altKey,
    button: event.button,
    buttons: event.buttons,
    clientX: event.clientX,
    clientY: event.clientY,
    ctrlKey: event.ctrlKey,
    metaKey: event.metaKey,
    movementX: event.movementX,
    movementY: event.movementY,
    screenX: event.screenX,
    screenY: event.screenY,
    shiftKey: event.shiftKey,
  });
}

export function wheelEventToECS(event: WheelEvent): LatticeWheelEvent {
  const data = new LatticeWheelEvent();

  data.deltaMode = event.deltaMode;
  data.deltaX = event.deltaX;
  data.deltaY = event.deltaY;
  data.deltaZ = event.deltaZ;

  return data;
}

export type WheelEventType = "wheel";

export function wheelEventFromECS(
  type: WheelEventType,
  event: LatticeWheelEvent
): WheelEvent {
  return new WheelEvent(type, {
    deltaMode: event.deltaMode,
    deltaX: event.deltaX,
    deltaY: event.deltaY,
    deltaZ: event.deltaZ,
  });
}

export function keyboardEventToECS(event: KeyboardEvent): LatticeKeyboardEvent {
  const data = new LatticeKeyboardEvent();

  data.altKey = event.altKey;
  data.ctrlKey = event.ctrlKey;
  data.key = keyToECS(event.key);
  data.metaKey = event.metaKey;
  data.repeat = event.repeat;
  data.shiftKey = event.shiftKey;

  return data;
}

export type KeyEventType = "keydown" | "keyup";

export function keyboardEventFromECS(
  type: KeyEventType,
  event: LatticeKeyboardEvent
): KeyboardEvent {
  return new KeyboardEvent(type, {
    altKey: event.altKey,
    ctrlKey: event.ctrlKey,
    key: keyFromECS(event.key),
    metaKey: event.metaKey,
    repeat: event.repeat,
    shiftKey: event.shiftKey,
  });
}

export function keyToECS(key: string): Key {
  // 0-9 are the numbers 0-9
  if (key.length === 1 && key >= "0" && key <= "9") {
    return Number(key);
  }

  // Try to find the key in the Key enum
  const keyEnum = Key[key as keyof typeof Key] as Key | undefined;
  if (keyEnum !== undefined) return keyEnum;

  // Unsupported key
  return Key.Undefined;
}

export function keyFromECS(key: number): string | undefined {
  // 0-9 are the numbers 0-9
  if (key >= 0 && key <= 9) {
    return String(key);
  }

  // Try to find the key in the Key enum
  const keyEnum = Key[key];
  if (keyEnum !== undefined) return keyEnum;

  // Unsupported key
  return undefined;
}
