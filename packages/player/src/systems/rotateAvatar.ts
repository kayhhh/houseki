import { InputStruct } from "@lattice-engine/input";
import { Parent, Rotation } from "@lattice-engine/scene";
import { Quaternion, Vector3 } from "three";
import { Mut, Query, Res, struct, SystemRes, With } from "thyseus";

import { PlayerAvatar, PlayerCamera } from "../components";
import { PlayerCameraView } from "../types";
import { getDirection } from "../utils/getDirection";
import { Input, readInput } from "../utils/readInput";

const THIRD_PERSON_ROTATION_SPEED = 0.1;

const quaternion = new Quaternion();
const quaternion2 = new Quaternion();
const vector3 = new Vector3();
const forwardVector = new Vector3(0, 0, -1);

@struct
class LocalStore {
  /**
   * Stores the target rotation of the avatar.
   */
  @struct.array({ length: 4, type: "f32" })
  declare targetRotation: Float32Array;
}

/**
 * System that rotates the player avatar, based on user input.
 */
export function rotateAvatar(
  localStore: SystemRes<LocalStore>,
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
        rotateFirstPerson(
          cameraRotation,
          avatarRotation,
          localStore.targetRotation
        );
      } else if (camera.currentView === PlayerCameraView.ThirdPerson) {
        rotateThirdPerson(
          input,
          cameraRotation,
          avatarRotation,
          localStore.targetRotation
        );
      }
    }
  }
}

/**
 * Roates the avatar to face the camera direction.
 */
function rotateFirstPerson(
  cameraRotation: Rotation,
  avatarRotation: Rotation,
  targetRotation: Float32Array
) {
  quaternion.set(
    cameraRotation.x,
    cameraRotation.y,
    cameraRotation.z,
    cameraRotation.w
  );

  quaternion.x = 0;
  quaternion.z = 0;
  quaternion.normalize();

  targetRotation[0] = quaternion.x;
  targetRotation[1] = quaternion.y;
  targetRotation[2] = quaternion.z;
  targetRotation[3] = quaternion.w;

  avatarRotation.set(
    targetRotation[0],
    targetRotation[1],
    targetRotation[2],
    targetRotation[3]
  );
}

/**
 * Rotates the avatar to face the input direction.
 */
function rotateThirdPerson(
  input: Input,
  cameraRotation: Rotation,
  avatarRotation: Rotation,
  targetRotation: Float32Array
) {
  // Set new target rotation if there is input
  if (input.x !== 0 || input.y !== 0) {
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

    targetRotation[0] = quaternion.x;
    targetRotation[1] = quaternion.y;
    targetRotation[2] = quaternion.z;
    targetRotation[3] = quaternion.w;
  }

  // Slerp the rotation
  quaternion2.set(
    avatarRotation.x,
    avatarRotation.y,
    avatarRotation.z,
    avatarRotation.w
  );
  quaternion2.slerp(quaternion, THIRD_PERSON_ROTATION_SPEED);
  avatarRotation.set(
    quaternion2.x,
    quaternion2.y,
    quaternion2.z,
    quaternion2.w
  );
}
