import {
  KeyboardEvent,
  MouseEvent,
  PointerEvent,
  WheelEvent,
} from "@lattice-engine/core";

export class PointerMoveEvent extends PointerEvent {}

export class PointerDownEvent extends PointerEvent {}

export class PointerUpEvent extends PointerEvent {}

export class PointerCancelEvent extends PointerEvent {}

export class ContextMenuEvent extends MouseEvent {}

export class OnWheelEvent extends WheelEvent {}

export class KeyDownEvent extends KeyboardEvent {}
