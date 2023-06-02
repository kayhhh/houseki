import { MainLoopTime } from "@lattice-engine/core";
import { Raycast } from "@lattice-engine/physics";
import { Parent, Transform } from "@lattice-engine/scene";
import { Quaternion, Vector3 } from "three";
import { Entity, Mut, Query, Res, With } from "thyseus";

import { PlayerBody, PlayerCamera, TargetPosition } from "../components";
import { PlayerCameraView } from "../types";
import { lerp } from "../utils/lerp";

/**
 * Offset to prevent camera from clipping into ground.
 */
const COLLISION_OFFSET = 0.85;
const LERP_STRENGTH = 0.05;

const quaternion = new Quaternion();
const vector3 = new Vector3();

/**
 * System that moves the player camera.
 */
export function moveCamera(
  time: Res<MainLoopTime>,
  cameras: Query<
    [PlayerCamera, Parent, Mut<Transform>, Mut<TargetPosition>, Mut<Raycast>]
  >,
  bodies: Query<[Entity, Transform], With<PlayerBody>>
) {
  for (const [
    camera,
    parent,
    cameraTransform,
    targetPosition,
    raycast,
  ] of cameras) {
    for (const [entity, bodyTransform] of bodies) {
      // Get body that matches camera
      if (entity.id !== parent.id) continue;

      raycast.excludeRigidBodyId = entity.id;

      raycast.origin.x = bodyTransform.translation.x + targetPosition.x;
      raycast.origin.y = bodyTransform.translation.y + targetPosition.y;
      raycast.origin.z = bodyTransform.translation.z + targetPosition.z;

      if (camera.currentView === PlayerCameraView.ThirdPerson) {
        const distance = raycast.hit
          ? Math.min(raycast.hitToi * COLLISION_OFFSET, camera.distance)
          : camera.distance;

        quaternion.set(
          cameraTransform.rotation.x,
          cameraTransform.rotation.y,
          cameraTransform.rotation.z,
          cameraTransform.rotation.w
        );
        vector3.set(0, 0, distance);
        vector3.applyQuaternion(quaternion);

        targetPosition.x += vector3.x;
        targetPosition.y += vector3.y;
        targetPosition.z += vector3.z;

        vector3.normalize();

        raycast.direction.fromObject(vector3);
      }

      // Lerp camera position
      const K = 1 - LERP_STRENGTH ** (time.delta * 100);
      cameraTransform.translation.x = lerp(
        cameraTransform.translation.x,
        targetPosition.x,
        K
      );
      cameraTransform.translation.y = lerp(
        cameraTransform.translation.y,
        targetPosition.y,
        K
      );
      cameraTransform.translation.z = lerp(
        cameraTransform.translation.z,
        targetPosition.z,
        K
      );
    }
  }
}
