import {
  type f32,
  type f64,
  type i8,
  type i16,
  struct,
  type u8,
  type u16,
  type u32,
} from "thyseus";

@struct
export class MouseEvent {
  altKey: boolean = false;
  button: i8 = 0;
  buttons: u16 = 0;
  clientX: u16 = 0;
  clientY: u16 = 0;
  ctrlKey: boolean = false;
  metaKey: boolean = false;
  movementX: i16 = 0;
  movementY: i16 = 0;
  screenX: u16 = 0;
  screenY: u16 = 0;
  shiftKey: boolean = false;
}

/**
 * PointerEvent extends MouseEvent
 */
@struct
export class PointerEvent {
  altKey: boolean = false;
  button: i8 = 0;
  buttons: u16 = 0;
  clientX: u16 = 0;
  clientY: u16 = 0;
  ctrlKey: boolean = false;
  metaKey: boolean = false;
  movementX: i16 = 0;
  movementY: i16 = 0;
  screenX: u16 = 0;
  screenY: u16 = 0;
  shiftKey: boolean = false;

  pointerId: u32 = 0;
  width: u16 = 0;
  height: u16 = 0;
  pressure: f32 = 0;
  tangentialPressure: f32 = 0;
  tiltX: f32 = 0;
  tiltY: f32 = 0;
  twist: u16 = 0;
  pointerType: u8 = 0;
  isPrimary: boolean = false;
}

@struct
export class WheelEvent {
  deltaX: f64 = 0;
  deltaY: f64 = 0;
  deltaZ: f64 = 0;
  deltaMode: u32 = 0;
}

@struct
export class KeyboardEvent {
  altKey: boolean = false;
  ctrlKey: boolean = false;
  key: u8 = 0;
  metaKey: boolean = false;
  repeat: boolean = false;
  shiftKey: boolean = false;
}

export class PointerMoveEvent extends PointerEvent { }
export class PointerDownEvent extends PointerEvent { }
export class PointerUpEvent extends PointerEvent { }
export class PointerCancelEvent extends PointerEvent { }
export class ContextMenuEvent extends MouseEvent { }
export class OnWheelEvent extends WheelEvent { }
export class KeyDownEvent extends KeyboardEvent { }
export class KeyUpEvent extends KeyboardEvent { }
