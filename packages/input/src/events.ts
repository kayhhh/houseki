import { struct } from "thyseus";

@struct
export class MouseEvent {
  @struct.bool declare altKey: boolean;
  @struct.u8 declare button: number;
  @struct.u16 declare buttons: number;
  @struct.u16 declare clientX: number;
  @struct.u16 declare clientY: number;
  @struct.bool declare ctrlKey: boolean;
  @struct.bool declare metaKey: boolean;
  @struct.i16 declare movementX: number;
  @struct.i16 declare movementY: number;
  @struct.u16 declare screenX: number;
  @struct.u16 declare screenY: number;
  @struct.bool declare shiftKey: boolean;
}

/**
 * PointerEvent extends MouseEvent
 */
@struct
export class PointerEvent {
  @struct.bool declare altKey: boolean;
  @struct.u8 declare button: number;
  @struct.u16 declare buttons: number;
  @struct.u16 declare clientX: number;
  @struct.u16 declare clientY: number;
  @struct.bool declare ctrlKey: boolean;
  @struct.bool declare metaKey: boolean;
  @struct.i16 declare movementX: number;
  @struct.i16 declare movementY: number;
  @struct.u16 declare screenX: number;
  @struct.u16 declare screenY: number;
  @struct.bool declare shiftKey: boolean;

  @struct.u32 declare pointerId: number;
  @struct.u16 declare width: number;
  @struct.u16 declare height: number;
  @struct.f32 declare pressure: number;
  @struct.f32 declare tangentialPressure: number;
  @struct.f32 declare tiltX: number;
  @struct.f32 declare tiltY: number;
  @struct.u16 declare twist: number;
  @struct.u8 declare pointerType: number; // PointerType
  @struct.bool declare isPrimary: boolean;
}

@struct
export class WheelEvent {
  @struct.f64 declare deltaX: number;
  @struct.f64 declare deltaY: number;
  @struct.f64 declare deltaZ: number;
  @struct.u32 declare deltaMode: number;
}

@struct
export class KeyboardEvent {
  @struct.bool declare altKey: boolean;
  @struct.bool declare ctrlKey: boolean;
  @struct.u8 declare key: number; // Key
  @struct.bool declare metaKey: boolean;
  @struct.bool declare repeat: boolean;
  @struct.bool declare shiftKey: boolean;
}

export class PointerMoveEvent extends PointerEvent {}
export class PointerDownEvent extends PointerEvent {}
export class PointerUpEvent extends PointerEvent {}
export class PointerCancelEvent extends PointerEvent {}
export class ContextMenuEvent extends MouseEvent {}
export class OnWheelEvent extends WheelEvent {}
export class KeyDownEvent extends KeyboardEvent {}
