import { Raycast } from "@lattice-engine/physics";
import { Parent, Position, Rotation } from "@lattice-engine/scene";
import { Quaternion, Vector3 } from "three";
import { Entity, Mut, Query, With } from "thyseus";

import { PlayerBody, PlayerCamera } from "../components";
import { PlayerCameraView } from "../types";

/**
 * Offset to prevent camera from clipping into ground.
 */
const COLLISION_OFFSET = 0.85;

const quaternion = new Quaternion();
const vector3 = new Vector3();

/**
 * System that moves the player camera.
 */
export function moveCamera(
  cameras: Query<[PlayerCamera, Parent, Rotation, Mut<Position>, Mut<Raycast>]>,
  bodies: Query<[Entity, Position], With<PlayerBody>>
) {
  for (const [camera, parent, rotation, cameraPosition, raycast] of cameras) {
    for (const [entity, bodyPosition] of bodies) {
      // Get body that matches camera
      if (entity.id !== parent.id) continue;

      raycast.excludeRigidBodyId = entity.id;

      raycast.origin.x = bodyPosition.x + cameraPosition.x;
      raycast.origin.y = bodyPosition.y + cameraPosition.y;
      raycast.origin.z = bodyPosition.z + cameraPosition.z;

      if (camera.currentView === PlayerCameraView.ThirdPerson) {
        const distance = raycast.hit
          ? Math.min(raycast.hitToi * COLLISION_OFFSET, camera.distance)
          : camera.distance;

        quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
        vector3.set(0, 0, distance);
        vector3.applyQuaternion(quaternion);

        cameraPosition.x += vector3.x;
        cameraPosition.y += vector3.y;
        cameraPosition.z += vector3.z;

        vector3.normalize();

        raycast.direction.fromObject(vector3);
      }
    }
  }
}
