import { Raycast } from "@houseki-engine/physics";
import { Transform } from "@houseki-engine/scene";
import { Quaternion, Vector3 } from "three";
import { Mut, Query } from "thyseus";

import { PlayerCamera, TargetTranslation } from "../components";
import { COLLISION_OFFSET } from "../constants";
import { PlayerCameraView } from "../types";

const quat = new Quaternion();
const vec3 = new Vector3();

export function moveCamera(
  cameras: Query<
    [PlayerCamera, Transform, Mut<TargetTranslation>, Mut<Raycast>]
  >
) {
  for (const [camera, transform, targetTranslation, raycast] of cameras) {
    raycast.excludeRigidBodyId = camera.bodyId;
    raycast.maxToi = camera.distance;

    raycast.origin.x = targetTranslation.x;
    raycast.origin.y = targetTranslation.y;
    raycast.origin.z = targetTranslation.z;

    if (camera.currentView === PlayerCameraView.ThirdPerson) {
      const distance = raycast.hit
        ? raycast.hitToi * COLLISION_OFFSET
        : raycast.maxToi;

      quat.set(
        transform.rotation.x,
        transform.rotation.y,
        transform.rotation.z,
        transform.rotation.w
      );
      vec3.set(0, 0, distance);
      vec3.applyQuaternion(quat);

      targetTranslation.x += vec3.x;
      targetTranslation.y += vec3.y;
      targetTranslation.z += vec3.z;

      vec3.normalize();

      raycast.direction.fromObject(vec3);
    }
  }
}
