import { MainLoopTime } from "@lattice-engine/core";
import { InputStruct, PointerMoveEvent } from "@lattice-engine/input";
import { Position, Rotation } from "@lattice-engine/scene";
import { Euler, Quaternion, Vector3 } from "three";
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
const vector3 = new Vector3();

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
 * System that moves and rotates the player camera.
 */
export function moveCamera(
  localStore: SystemRes<LocalStore>,
  time: Res<MainLoopTime>,
  inputStruct: Res<InputStruct>,
  pointerMoveReader: EventReader<PointerMoveEvent>,
  entities: Query<[PlayerCamera, Mut<Position>, Mut<Rotation>]>
) {
  // Update target rotation on pointer move
  for (const event of pointerMoveReader) {
    // TODO: Support non pointer lock controls.
    if (!inputStruct.isPointerLocked) continue;

    for (const [camera] of entities) {
      rotateCamera(event, camera, localStore.targetRotation);
    }
  }

  for (const [camera, position, rotation] of entities) {
    // Slerp towards target rotation
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

    // Move camera
    position.x = 0;
    position.y = 0;
    position.z = 0;

    if (camera.currentView === PlayerCameraView.ThirdPerson) {
      moveThirdPerson(position, camera);
    }
  }
}

/**
 * Rotates the camera according to a pointer move event.
 */
function rotateCamera(
  event: PointerMoveEvent,
  camera: PlayerCamera,
  targetRotation: Float32Array
) {
  euler.setFromQuaternion(
    quaternion.set(
      targetRotation[0] ?? 0,
      targetRotation[1] ?? 0,
      targetRotation[2] ?? 0,
      targetRotation[3] ?? 1
    )
  );

  euler.y -= event.movementX * SENSITIVITY;
  euler.x -= event.movementY * SENSITIVITY;

  // Clamp vertical rotation
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

  targetRotation[0] = quaternion.x;
  targetRotation[1] = quaternion.y;
  targetRotation[2] = quaternion.z;
  targetRotation[3] = quaternion.w;
}

/**
 * Moves the camera in third person mode.
 */
function moveThirdPerson(position: Position, camera: PlayerCamera) {
  vector3.set(0, 0, camera.distance);
  vector3.applyQuaternion(quaternion);

  position.x = vector3.x;
  position.y = vector3.y;
  position.z = vector3.z;
}
