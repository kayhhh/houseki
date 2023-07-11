import { Raycast } from "@lattice-engine/physics";
import { Parent, Transform } from "@lattice-engine/scene";
import { Quaternion, Vector3 } from "three";
import { Entity, Mut, Query, With } from "thyseus";

import { PlayerBody, PlayerCamera, TargetTranslation } from "../components";
import { COLLISION_OFFSET } from "../constants";
import { PlayerCameraView } from "../types";

const quaternion = new Quaternion();
const vector3 = new Vector3();

/**
 * System that moves the player camera.
 */
export function moveCamera(
  cameras: Query<
    [PlayerCamera, Parent, Transform, Mut<TargetTranslation>, Mut<Raycast>]
  >,
  bodies: Query<[Entity, Transform], With<PlayerBody>>
) {
  for (const [
    camera,
    parent,
    cameraTransform,
    targetTranslation,
    raycast,
  ] of cameras) {
    for (const [entity, bodyTransform] of bodies) {
      // Get body that matches camera
      if (entity.id !== parent.id) continue;

      raycast.excludeRigidBodyId = entity.id;
      raycast.maxToi = camera.distance;

      raycast.origin.x = bodyTransform.translation.x + targetTranslation.x;
      raycast.origin.y = bodyTransform.translation.y + targetTranslation.y;
      raycast.origin.z = bodyTransform.translation.z + targetTranslation.z;

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
}
