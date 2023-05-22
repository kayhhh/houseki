import { InputStruct, PointerMoveEvent } from "@lattice-engine/input";
import { Rotation } from "@lattice-engine/scene";
import { Euler, Quaternion } from "three";
import { EventReader, Mut, Query, Res, With } from "thyseus";

import { PlayerControls } from "./components";

const minPolarAngle = 0;
const maxPolarAngle = Math.PI;

const euler = new Euler(0, 0, 0, "YXZ");
const quaternion = new Quaternion();

/**
 * Rotates the camera based on mouse movement.
 */
export function rotatePlayer(
  inputStruct: Res<InputStruct>,
  pointerMoveReader: EventReader<PointerMoveEvent>,
  rotations: Query<Mut<Rotation>, With<PlayerControls>>
) {
  // TODO: Support non pointer lock controls.
  if (!inputStruct.isPointerLocked) return;

  // Update rotation on pointer move
  for (const event of pointerMoveReader) {
    for (const rotation of rotations) {
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
