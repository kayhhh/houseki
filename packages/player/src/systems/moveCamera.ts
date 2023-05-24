import { InputStruct, PointerMoveEvent } from "@lattice-engine/input";
import { Position, Rotation } from "@lattice-engine/scene";
import { Euler, Quaternion, Vector3 } from "three";
import { EventReader, Mut, Query, Res } from "thyseus";

import { PlayerCamera } from "../components";
import { PlayerCameraView } from "../types";

const MIN_FIRST_PERSON_ANGLE = Math.PI / 10;
const MAX_FIRST_PERSON_ANGLE = Math.PI - MIN_FIRST_PERSON_ANGLE;

const MIN_THIRD_PERSON_ANGLE = 0;
const MAX_THIRD_PERSON_ANGLE = Math.PI;

const euler = new Euler(0, 0, 0, "YXZ");
const quaternion = new Quaternion();
const vector3 = new Vector3();

/**
 * System that moves the player camera.
 */
export function moveCamera(
  inputStruct: Res<InputStruct>,
  pointerMoveReader: EventReader<PointerMoveEvent>,
  entities: Query<[PlayerCamera, Mut<Position>, Mut<Rotation>]>
) {
  // Update rotation on pointer move
  for (const event of pointerMoveReader) {
    // TODO: Support non pointer lock controls.
    if (!inputStruct.isPointerLocked) continue;

    for (const [camera, , rotation] of entities) {
      rotateCamera(event, camera, rotation);
    }
  }

  // Move camera
  for (const [camera, position] of entities) {
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
  rotation: Rotation
) {
  euler.setFromQuaternion(
    quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w)
  );

  euler.y -= event.movementX * 0.002;
  euler.x -= event.movementY * 0.002;

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

  rotation.x = quaternion.x;
  rotation.y = quaternion.y;
  rotation.z = quaternion.z;
  rotation.w = quaternion.w;
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
