import { MainLoopTime } from "@lattice-engine/core";
import { InputStruct, PointerMoveEvent } from "@lattice-engine/input";
import { Rotation } from "@lattice-engine/scene";
import { Euler, Quaternion } from "three";
import {
  EventReader,
  initStruct,
  Mut,
  Query,
  Res,
  struct,
  SystemRes,
} from "thyseus";

import { PlayerCamera } from "../components";
import { PlayerCameraView } from "../types";

const SENSITIVITY = 0.002;

const FIRST_PERSON_SLERP = 10e-18;
const MIN_FIRST_PERSON_ANGLE = Math.PI / 10;
const MAX_FIRST_PERSON_ANGLE = Math.PI - MIN_FIRST_PERSON_ANGLE;

const THIRD_PERSON_SLERP = 10e-14;
const MIN_THIRD_PERSON_ANGLE = 0;
const MAX_THIRD_PERSON_ANGLE = Math.PI;

const euler = new Euler(0, 0, 0, "YXZ");
const quaternion = new Quaternion();
const quaternion2 = new Quaternion();

@struct
class LocalStore {
  /**
   * Stores the target rotation of the avatar.
   */
  @struct.array({ length: 4, type: "f32" })
  declare targetRotation: Float32Array;

  constructor() {
    initStruct(this);

    this.targetRotation.set([0, 0, 0, 1]);
  }
}

/**
 * System that rotates the player camera.
 */
export function rotateCamera(
  localStore: SystemRes<LocalStore>,
  time: Res<MainLoopTime>,
  inputStruct: Res<InputStruct>,
  pointerMoveReader: EventReader<PointerMoveEvent>,
  entities: Query<[PlayerCamera, Mut<Rotation>]>
) {
  // Update target rotation on pointer move
  for (const event of pointerMoveReader) {
    // TODO: Support non pointer lock controls.
    if (!inputStruct.isPointerLocked) continue;

    for (const [camera] of entities) {
      euler.setFromQuaternion(
        quaternion.set(
          localStore.targetRotation[0] ?? 0,
          localStore.targetRotation[1] ?? 0,
          localStore.targetRotation[2] ?? 0,
          localStore.targetRotation[3] ?? 1
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

      localStore.targetRotation[0] = quaternion.x;
      localStore.targetRotation[1] = quaternion.y;
      localStore.targetRotation[2] = quaternion.z;
      localStore.targetRotation[3] = quaternion.w;
    }
  }

  // Slerp towards target rotation
  for (const [camera, rotation] of entities) {
    quaternion2.set(
      localStore.targetRotation[0] ?? 0,
      localStore.targetRotation[1] ?? 0,
      localStore.targetRotation[2] ?? 0,
      localStore.targetRotation[3] ?? 1
    );

    const slerpStrength =
      camera.currentView === PlayerCameraView.FirstPerson
        ? FIRST_PERSON_SLERP
        : THIRD_PERSON_SLERP;
    const K = 1 - Math.pow(slerpStrength, time.delta);

    quaternion
      .set(rotation.x, rotation.y, rotation.z, rotation.w)
      .slerp(quaternion2, K);

    rotation.x = quaternion.x;
    rotation.y = quaternion.y;
    rotation.z = quaternion.z;
    rotation.w = quaternion.w;
  }
}
