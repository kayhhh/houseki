import { Raycast } from "@houseki-engine/physics";
import { Transform } from "@houseki-engine/scene";
import { Quaternion, Vector3 } from "three";
import { Mut, Query } from "thyseus";

import { PlayerCamera, TargetTranslation } from "../components";
import { COLLISION_OFFSET } from "../constants";
import { PlayerCameraView } from "../types";

const quaternion = new Quaternion();
const vector3 = new Vector3();

export function moveCamera(
  cameras: Query<
    [PlayerCamera, Transform, Mut<TargetTranslation>, Mut<Raycast>]
  >
) {
  for (const [camera, cameraTransform, targetTranslation, raycast] of cameras) {
    raycast.excludeRigidBodyId = camera.bodyId;
    raycast.maxToi = camera.distance;

    raycast.origin.x = targetTranslation.x;
    raycast.origin.y = targetTranslation.y;
    raycast.origin.z = targetTranslation.z;

    if (camera.currentView === PlayerCameraView.ThirdPerson) {
      const distance = raycast.hit
        ? raycast.hitToi * COLLISION_OFFSET
        : raycast.maxToi;

      quaternion.set(
        cameraTransform.rotation.x,
        cameraTransform.rotation.y,
        cameraTransform.rotation.z,
        cameraTransform.rotation.w
      );
      vector3.set(0, 0, distance);
      vector3.applyQuaternion(quaternion);

      targetTranslation.x += vector3.x;
      targetTranslation.y += vector3.y;
      targetTranslation.z += vector3.z;

      vector3.normalize();

      raycast.direction.fromObject(vector3);
    }
  }
}
