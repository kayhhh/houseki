import { InputStruct, PointerMoveEvent } from "@lattice-engine/input";
import { Euler, Quaternion } from "three";
import { EventReader, Mut, Query, Res } from "thyseus";

import { PlayerCamera, TargetRotation } from "../components";
import { PlayerCameraView } from "../types";

const SENSITIVITY = 0.002;
const SENSITIVITY_NO_POINTER_LOCK = SENSITIVITY * 2;

const MIN_FIRST_PERSON_ANGLE = Math.PI / 10;
const MAX_FIRST_PERSON_ANGLE = Math.PI - MIN_FIRST_PERSON_ANGLE;

const MIN_THIRD_PERSON_ANGLE = 0;
const MAX_THIRD_PERSON_ANGLE = Math.PI;

const euler = new Euler(0, 0, 0, "YXZ");
const quaternion = new Quaternion();

export function rotateCamera(
  inputStruct: Res<InputStruct>,
  pointerMoveReader: EventReader<PointerMoveEvent>,
  entities: Query<[PlayerCamera, Mut<TargetRotation>]>
) {
  const rotate = inputStruct.enablePointerLock
    ? inputStruct.isPointerLocked
    : inputStruct.isPointerDown;

  const sensitivity = inputStruct.enablePointerLock
    ? SENSITIVITY
    : SENSITIVITY_NO_POINTER_LOCK;

  // Update target rotation on pointer move
  for (const event of pointerMoveReader) {
    if (!rotate) continue;

    for (const [camera, targetRotation] of entities) {
      quaternion.set(
        targetRotation.x,
        targetRotation.y,
        targetRotation.z,
        targetRotation.w
      );

      euler.setFromQuaternion(quaternion);

      euler.y -= event.movementX * sensitivity;
      euler.x -= event.movementY * sensitivity;

      const minAngle =
        camera.currentView === PlayerCameraView.FirstPerson
          ? MIN_FIRST_PERSON_ANGLE
          : MIN_THIRD_PERSON_ANGLE;
      const maxAngle =
        camera.currentView === PlayerCameraView.FirstPerson
          ? MAX_FIRST_PERSON_ANGLE
          : MAX_THIRD_PERSON_ANGLE;

      euler.x = Math.max(
        Math.PI / 2 - maxAngle,
        Math.min(Math.PI / 2 - minAngle, euler.x)
      );

      quaternion.setFromEuler(euler);

      targetRotation.fromObject(quaternion);
    }
  }
}
