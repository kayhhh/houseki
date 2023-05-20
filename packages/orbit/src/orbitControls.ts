import {
  keyboardEventFromECS,
  mouseEventFromECS,
  pointerEventFromECS,
  wheelEventFromECS,
} from "@lattice-engine/input";
import { RenderStore } from "@lattice-engine/render";
import { PerspectiveCamera, Position } from "@lattice-engine/scene";
import { OrbitControls as ThreeOrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  Entity,
  EventReader,
  EventReaderDescriptor,
  Mut,
  MutDescriptor,
  Query,
  QueryDescriptor,
  Res,
  ResourceDescriptor,
  SystemRes,
  SystemResourceDescriptor,
  With,
  WithDescriptor,
} from "thyseus";

import { IsOrbitControls } from "./components";
import {
  ContextMenuEvent,
  KeyDownEvent,
  OnWheelEvent,
  PointerCancelEvent,
  PointerDownEvent,
  PointerMoveEvent,
  PointerUpEvent,
} from "./events";

/**
 * Mock Element we can pass into Three.js OrbitControls.
 * We use this to capture events from the ECS and pass them into OrbitControls.
 */
class MockElement extends EventTarget {
  style = {};
  setPointerCapture() {}
  releasePointerCapture() {}
  clientHeight = 0;
  clientWidth = 0;
}

class LocalStore {
  readonly mockElement = new MockElement();

  /**
   * Entity ID -> Three.js OrbitControls object
   */
  readonly map = new Map<bigint, ThreeOrbitControls>();
}

export function orbitControls(
  store: Res<RenderStore>,
  localStore: SystemRes<LocalStore>,
  entities: Query<Entity, With<[IsOrbitControls, PerspectiveCamera]>>,
  withPositions: Query<[Entity, Mut<Position>], With<PerspectiveCamera>>,
  pointerMoveReader: EventReader<PointerMoveEvent>,
  pointerDownReader: EventReader<PointerDownEvent>,
  pointerUpReader: EventReader<PointerUpEvent>,
  pointerCancelReader: EventReader<PointerCancelEvent>,
  contextMenuReader: EventReader<ContextMenuEvent>,
  onWheelReader: EventReader<OnWheelEvent>,
  keyDownReader: EventReader<KeyDownEvent>
) {
  const ids: bigint[] = [];

  // Update mock element size
  localStore.mockElement.clientWidth = store.renderer.domElement.clientWidth;
  localStore.mockElement.clientHeight = store.renderer.domElement.clientHeight;

  // Create new objects
  for (const { id } of entities) {
    ids.push(id);

    if (localStore.map.has(id)) continue;

    const cameraObject = store.perspectiveCameras.get(id);
    if (!cameraObject) continue;

    const object = new ThreeOrbitControls(
      cameraObject,
      localStore.mockElement as any
    );
    object.enableDamping = true;

    localStore.map.set(id, object);
  }

  // Send events to mock element
  for (const data of pointerDownReader) {
    const event = pointerEventFromECS("pointerdown", data);
    localStore.mockElement.dispatchEvent(event);
  }

  for (const data of pointerMoveReader) {
    const event = pointerEventFromECS("pointermove", data);
    localStore.mockElement.dispatchEvent(event);
  }

  for (const data of pointerCancelReader) {
    const event = pointerEventFromECS("pointercancel", data);
    localStore.mockElement.dispatchEvent(event);
  }

  for (const data of pointerUpReader) {
    const event = pointerEventFromECS("pointerup", data);
    localStore.mockElement.dispatchEvent(event);
  }

  for (const data of contextMenuReader) {
    const event = mouseEventFromECS("contextmenu", data);
    localStore.mockElement.dispatchEvent(event);
  }

  for (const data of onWheelReader) {
    const event = wheelEventFromECS("wheel", data);
    localStore.mockElement.dispatchEvent(event);
  }

  for (const data of keyDownReader) {
    const event = keyboardEventFromECS("keydown", data);
    localStore.mockElement.dispatchEvent(event);
  }

  // Clear event queues
  pointerMoveReader.clear();
  pointerDownReader.clear();
  pointerUpReader.clear();
  pointerCancelReader.clear();
  contextMenuReader.clear();
  onWheelReader.clear();
  keyDownReader.clear();

  // Update objects
  for (const object of localStore.map.values()) {
    object.update();
  }

  // Copy positions into ECS
  for (const [{ id }, position] of withPositions) {
    const object = localStore.map.get(id);
    if (!object) continue;

    const cameraObject = store.perspectiveCameras.get(id);
    if (!cameraObject) continue;

    position.x = cameraObject.position.x;
    position.y = cameraObject.position.y;
    position.z = cameraObject.position.z;
  }

  // Remove objects that no longer exist
  for (const id of localStore.map.keys()) {
    if (!ids.includes(id)) {
      const object = localStore.map.get(id) as ThreeOrbitControls;
      if (object) object.dispose();

      localStore.map.delete(id);
    }
  }
}

orbitControls.parameters = [
  ResourceDescriptor(RenderStore),
  SystemResourceDescriptor(LocalStore),
  QueryDescriptor(Entity, WithDescriptor(IsOrbitControls)),
  QueryDescriptor(
    [Entity, MutDescriptor(Position)],
    WithDescriptor(PerspectiveCamera)
  ),
  EventReaderDescriptor(PointerMoveEvent),
  EventReaderDescriptor(PointerDownEvent),
  EventReaderDescriptor(PointerUpEvent),
  EventReaderDescriptor(PointerCancelEvent),
  EventReaderDescriptor(ContextMenuEvent),
  EventReaderDescriptor(OnWheelEvent),
  EventReaderDescriptor(KeyDownEvent),
];
