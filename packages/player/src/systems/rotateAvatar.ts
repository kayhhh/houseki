import { InputStruct } from "@lattice-engine/input";
import { Parent, Rotation } from "@lattice-engine/scene";
import { Quaternion, Vector3 } from "three";
import { Mut, Query, Res, With } from "thyseus";

import { PlayerAvatar, PlayerCamera } from "../components";
import { PlayerCameraView } from "../types";
import { getDirection } from "../utils/getDirection";
import { Input, readInput } from "../utils/readInput";

const quaternion = new Quaternion();
const vector3 = new Vector3();
const forwardVector = new Vector3(0, 0, -1);

/**
 * System that rotates the player avatar, based on user input.
 */
export function rotateAvatar(
  inputStruct: Res<InputStruct>,
  cameras: Query<[PlayerCamera, Parent, Rotation]>,
  avatars: Query<[Parent, Mut<Rotation>], With<PlayerAvatar>>
) {
  const input = readInput(inputStruct);

  for (const [camera, parent, cameraRotation] of cameras) {
    for (const [avatarParent, avatarRotation] of avatars) {
      // Find the avatar that matches the camera parent
      if (avatarParent.id !== parent.id) continue;

      if (camera.currentView === PlayerCameraView.FirstPerson) {
        rotateFirstPerson(cameraRotation, avatarRotation);
      } else if (camera.currentView === PlayerCameraView.ThirdPerson) {
        rotateThirdPerson(input, cameraRotation, avatarRotation);
      }
    }
  }
}

/**
 * Roates the avatar to face the camera direction.
 */
function rotateFirstPerson(cameraRotation: Rotation, avatarRotation: Rotation) {
  quaternion.set(
    cameraRotation.x,
    cameraRotation.y,
    cameraRotation.z,
    cameraRotation.w
  );

  quaternion.x = 0;
  quaternion.z = 0;
  quaternion.normalize();

  avatarRotation.x = quaternion.x;
  avatarRotation.y = quaternion.y;
  avatarRotation.z = quaternion.z;
  avatarRotation.w = quaternion.w;
}

/**
 * Rotates the avatar to face the input direction.
 */
function rotateThirdPerson(
  input: Input,
  cameraRotation: Rotation,
  avatarRotation: Rotation
) {
  if (input.x === 0 && input.y === 0) return;

  const direction = getDirection(cameraRotation);

  vector3.set(
    input.x * direction.x + input.y * direction.z,
    0,
    input.x * direction.z - input.y * direction.x
  );

  quaternion.setFromUnitVectors(forwardVector, vector3);

  quaternion.x = 0;
  quaternion.z = 0;
  quaternion.normalize();

  avatarRotation.x = quaternion.x;
  avatarRotation.y = quaternion.y;
  avatarRotation.z = quaternion.z;
  avatarRotation.w = quaternion.w;
}
