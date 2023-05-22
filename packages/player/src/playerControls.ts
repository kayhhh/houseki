import { InputStruct, PointerMoveEvent } from "@lattice-engine/input";
import { Rotation } from "@lattice-engine/scene";
import { Euler, Quaternion } from "three";
import { Entity, EventReader, Mut, Query, Res, With, Without } from "thyseus";

import { PlayerControls } from "./components";

const minPolarAngle = 0;
const maxPolarAngle = Math.PI;

const euler = new Euler(0, 0, 0, "YXZ");
const quaternion = new Quaternion();

export function playerControls(
  inputStruct: Res<InputStruct>,
  pointerMoveReader: EventReader<PointerMoveEvent>,
  withoutRotation: Query<Entity, [With<PlayerControls>, Without<Rotation>]>,
  withRotation: Query<Mut<Rotation>, With<PlayerControls>>
) {
  // TODO: Support non pointer lock controls.
  if (!inputStruct.isPointerLocked) return;

  // Add rotation component to entities that don't have it yet
  for (const entity of withoutRotation) {
    entity.addType(Rotation);
  }

  // Update rotation component for entities that have it
  for (const event of pointerMoveReader) {
    for (const rotation of withRotation) {
      euler.setFromQuaternion(
        quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w)
      );

      euler.y -= event.movementX * 0.002;
      euler.x -= event.movementY * 0.002;

      euler.x = Math.max(
        Math.PI / 2 - maxPolarAngle,
        Math.min(Math.PI / 2 - minPolarAngle, euler.x)
      );

      quaternion.setFromEuler(euler);

      rotation.x = quaternion.x;
      rotation.y = quaternion.y;
      rotation.z = quaternion.z;
      rotation.w = quaternion.w;
    }
  }
}
