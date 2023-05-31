import { Position, Rotation } from "@lattice-engine/scene";
import { Quaternion, Vector3 } from "three";
import { Mut, Query } from "thyseus";

import { PlayerCamera } from "../components";
import { PlayerCameraView } from "../types";

const quaternion = new Quaternion();
const vector3 = new Vector3();

/**
 * System that moves the player camera.
 */
export function moveCamera(
  entities: Query<[PlayerCamera, Rotation, Mut<Position>]>
) {
  for (const [camera, rotation, position] of entities) {
    position.x = 0;
    position.y = 0;
    position.z = 0;

    if (camera.currentView === PlayerCameraView.ThirdPerson) {
      moveThirdPerson(position, rotation, camera);
    }
  }
}

/**
 * Moves the camera in third person mode.
 */
function moveThirdPerson(
  position: Position,
  rotation: Rotation,
  camera: PlayerCamera
) {
  quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
  vector3.set(0, 0, camera.distance);
  vector3.applyQuaternion(quaternion);

  // TODO: Use collision detection to prevent camera from clipping through walls.

  position.x = vector3.x;
  position.y = vector3.y;
  position.z = vector3.z;
}
