import { Vec4 } from "@lattice-engine/core";
import { Velocity } from "@lattice-engine/physics";
import { Parent, Transform } from "@lattice-engine/scene";
import { Quaternion, Vector3 } from "three";
import { Entity, Mut, Query, With } from "thyseus";

import {
  PlayerAvatar,
  PlayerBody,
  PlayerCamera,
  TargetRotation,
} from "../components";
import { PlayerCameraView } from "../types";
import { getDirection } from "../utils/getDirection";

const THIRD_PERSON_ROTATION_SPEED = 0.1;

const quaternion = new Quaternion();
const quaternion2 = new Quaternion();
const vector3 = new Vector3();
const upVector = new Vector3(0, 1, 0);

export function rotateAvatar(
  cameras: Query<[PlayerCamera, Parent, Transform]>,
  avatars: Query<
    [Parent, Mut<Transform>, Mut<TargetRotation>],
    With<PlayerAvatar>
  >,
  bodies: Query<[Entity, Velocity], With<PlayerBody>>
) {
  for (const [camera, parent, cameraTransform] of cameras) {
    for (const [avatarParent, avatarTransform, targetRotation] of avatars) {
      // Find the avatar that matches the camera parent
      if (avatarParent.id !== parent.id) continue;

      for (const [entity, velocity] of bodies) {
        // Find the body that matches the avatar
        if (entity.id !== avatarParent.id) continue;

        if (camera.currentView === PlayerCameraView.FirstPerson) {
          rotateFirstPerson(
            cameraTransform.rotation,
            avatarTransform.rotation,
            targetRotation
          );
        } else if (camera.currentView === PlayerCameraView.ThirdPerson) {
          rotateThirdPerson(
            velocity,
            cameraTransform.rotation,
            avatarTransform.rotation,
            targetRotation
          );
        }
      }
    }
  }
}

function rotateFirstPerson(
  cameraRotation: Vec4,
  avatarRotation: Vec4,
  targetRotation: Vec4
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

  targetRotation.fromObject(quaternion);

  avatarRotation.copy(targetRotation);
}

function rotateThirdPerson(
  velocity: Velocity,
  cameraRotation: Vec4,
  avatarRotation: Vec4,
  targetRotation: Vec4
) {
  // Set new target rotation if there is input
  if (velocity.x !== 0 || velocity.z !== 0) {
    const direction = getDirection(cameraRotation);

    vector3.set(
      velocity.x * direction.x + velocity.z * direction.z,
      0,
      velocity.x * direction.z - velocity.z * direction.x
    );

    quaternion.setFromAxisAngle(upVector, Math.atan2(-velocity.x, -velocity.z));

    quaternion.x = 0;
    quaternion.z = 0;
    quaternion.normalize();

    targetRotation.fromObject(quaternion);
  } else {
    quaternion.set(
      targetRotation.x,
      targetRotation.y,
      targetRotation.z,
      targetRotation.w
    );
  }

  // Slerp the rotation
  quaternion2.set(
    avatarRotation.x,
    avatarRotation.y,
    avatarRotation.z,
    avatarRotation.w
  );
  quaternion2.slerp(quaternion, THIRD_PERSON_ROTATION_SPEED);
  avatarRotation.fromObject(quaternion2);
}
