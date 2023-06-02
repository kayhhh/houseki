import { MainLoopTime } from "@lattice-engine/core";
import { InputStruct, PointerMoveEvent } from "@lattice-engine/input";
import { Transform } from "@lattice-engine/scene";
import { Euler, Quaternion } from "three";
import { EventReader, Mut, Query, Res } from "thyseus";

import { PlayerCamera, TargetRotation } from "../components";
import { PlayerCameraView } from "../types";

const SENSITIVITY = 0.002;

const FIRST_PERSON_SLERP = 1e-17;
const MIN_FIRST_PERSON_ANGLE = Math.PI / 10;
const MAX_FIRST_PERSON_ANGLE = Math.PI - MIN_FIRST_PERSON_ANGLE;

const THIRD_PERSON_SLERP = 1e-13;
const MIN_THIRD_PERSON_ANGLE = 0;
const MAX_THIRD_PERSON_ANGLE = Math.PI;

const euler = new Euler(0, 0, 0, "YXZ");
const quaternion = new Quaternion();
const quaternion2 = new Quaternion();

export function rotateCamera(
  time: Res<MainLoopTime>,
  inputStruct: Res<InputStruct>,
  pointerMoveReader: EventReader<PointerMoveEvent>,
  entities: Query<[PlayerCamera, Mut<TargetRotation>, Mut<Transform>]>
) {
  // Update target rotation on pointer move
  for (const event of pointerMoveReader) {
    // TODO: Support non pointer lock controls.
    if (!inputStruct.isPointerLocked) continue;

    for (const [camera, targetRotation] of entities) {
      euler.setFromQuaternion(
        quaternion.set(
          targetRotation.x,
          targetRotation.y,
          targetRotation.z,
          targetRotation.w
        )
      );

      euler.y -= event.movementX * SENSITIVITY;
      euler.x -= event.movementY * SENSITIVITY;

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

  // Slerp towards target rotation
  for (const [camera, targetRotation, transform] of entities) {
    quaternion2.set(
      targetRotation.x,
      targetRotation.y,
      targetRotation.z,
      targetRotation.w
    );

    const slerpStrength =
      camera.currentView === PlayerCameraView.FirstPerson
        ? FIRST_PERSON_SLERP
        : THIRD_PERSON_SLERP;
    const K = 1 - Math.pow(slerpStrength, time.delta);

    quaternion
      .set(
        transform.rotation.x,
        transform.rotation.y,
        transform.rotation.z,
        transform.rotation.w
      )
      .slerp(quaternion2, K);

    transform.rotation.fromObject(quaternion);
  }
}
