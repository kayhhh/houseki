import { OnWheelEvent } from "@lattice-engine/input";
import { EventReader, Query } from "thyseus";

import { PlayerCamera } from "./components";
import { PlayerCameraMode, PlayerCameraView } from "./types";

const MIN_CAMERA_DISTANCE = 1;
const MAX_CAMERA_DISTANCE = 10;

/**
 * Zooms the camera in and out when in third person,
 * optionally switching into or out of first person mode.
 */
export function zoomCamera(
  wheelEventReader: EventReader<OnWheelEvent>,
  entities: Query<PlayerCamera>
) {
  for (const event of wheelEventReader) {
    for (const camera of entities) {
      if (camera.currentView === PlayerCameraView.FirstPerson) {
        zoomFirstPerson(event, camera);
      } else if (camera.currentView === PlayerCameraView.ThirdPerson) {
        zoomThirdPerson(event, camera);
      }
    }
  }
}

/**
 * Zooms the camera out of first person mode.
 */
function zoomFirstPerson(event: OnWheelEvent, camera: PlayerCamera) {
  // Only zoom out if third person mode is allowed
  if (camera.mode !== PlayerCameraMode.Both) return;

  // Change to third person mode if zooming out
  if (event.deltaY > 0) {
    camera.currentView = PlayerCameraView.ThirdPerson;
    camera.distance = MIN_CAMERA_DISTANCE;
  }
}

/**
 * Zooms the camera when in third person mode.
 */
function zoomThirdPerson(event: OnWheelEvent, camera: PlayerCamera) {
  // Zoom in
  if (event.deltaY < 0) {
    camera.distance = Math.max(MIN_CAMERA_DISTANCE, camera.distance - 1);

    // Change to first person mode if at minimum distance
    if (camera.distance === MIN_CAMERA_DISTANCE) {
      camera.currentView = PlayerCameraView.FirstPerson;
    }
  }

  // Zoom out
  if (event.deltaY > 0) {
    camera.distance = Math.min(MAX_CAMERA_DISTANCE, camera.distance + 1);
  }
}
