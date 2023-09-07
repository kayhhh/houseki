import { Time } from "@reddo/core";
import { TargetTransform, Velocity } from "@reddo/physics";
import { Quat, Transform } from "@reddo/scene";
import { Quaternion, Vector3 } from "three";
import { Entity, Mut, Query, Res, With } from "thyseus";

import { PlayerBody, PlayerCamera, TargetRotation } from "../components";
import { PlayerCameraView } from "../types";
import { getDirection } from "../utils/getDirection";

const SLERP_FACTOR = 1e-7;

const quaternion = new Quaternion();
const quaternion2 = new Quaternion();
const vector3 = new Vector3();
const upVector = new Vector3(0, 1, 0);

export function rotateBody(
  time: Res<Time>,
  cameras: Query<[PlayerCamera, TargetRotation]>,
  bodies: Query<
    [
      Entity,
      Velocity,
      Mut<Transform>,
      Mut<TargetTransform>,
      Mut<TargetRotation>
    ],
    With<PlayerBody>
  >
) {
  for (const [camera, cameraRotation] of cameras) {
    for (const [
      entity,
      velocity,
      transform,
      targetTransform,
      targetRotation,
    ] of bodies) {
      // Find the body that matches the camera
      if (entity.id !== camera.bodyId) continue;

      if (camera.currentView === PlayerCameraView.FirstPerson) {
        rotateFirstPerson(
          cameraRotation,
          targetTransform.rotation,
          targetRotation
        );
      } else if (camera.currentView === PlayerCameraView.ThirdPerson) {
        rotateThirdPerson(
          velocity,
          cameraRotation,
          targetTransform.rotation,
          targetRotation,
          time
        );
      }

      transform.rotation.copy(targetTransform.rotation);
    }
  }
}

function rotateFirstPerson(
  cameraRotation: Quat,
  bodyRotation: Quat,
  targetRotation: Quat
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

  bodyRotation.fromObject(quaternion);
  targetRotation.fromObject(quaternion);
}

function rotateThirdPerson(
  velocity: Velocity,
  cameraRotation: Quat,
  bodyRotation: Quat,
  targetRotation: Quat,
  time: Time
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
  const K = 1 - Math.pow(SLERP_FACTOR, time.mainDelta);

  quaternion2.set(
    bodyRotation.x,
    bodyRotation.y,
    bodyRotation.z,
    bodyRotation.w
  );
  quaternion2.slerp(quaternion, K);
  bodyRotation.fromObject(quaternion2);
}
