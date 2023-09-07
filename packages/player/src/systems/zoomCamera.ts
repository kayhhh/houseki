import { Time } from "@reddo/core";
import { OnWheelEvent } from "@reddo/input";
import { lerp } from "three/src/math/MathUtils";
import { EventReader, Mut, Query, Res } from "thyseus";

import { PlayerCamera } from "../components";
import { PlayerCameraMode, PlayerCameraView } from "../types";

const MIN_CAMERA_DISTANCE = 1;
const MAX_CAMERA_DISTANCE = 10;

const LERP_STRENGTH = 1e-8;

/**
 * Zooms the camera in and out when in third person,
 * optionally switching into or out of first person mode.
 */
export function zoomCamera(
  time: Res<Time>,
  wheelEventReader: EventReader<OnWheelEvent>,
  entities: Query<Mut<PlayerCamera>>
) {
  for (const camera of entities) {
    for (const event of wheelEventReader) {
      if (camera.currentView === PlayerCameraView.FirstPerson) {
        // Only zoom out if we're in both mode
        if (camera.mode === PlayerCameraMode.Both && event.deltaY > 0) {
          zoomOut(camera);
        }
      } else if (camera.currentView === PlayerCameraView.ThirdPerson) {
        if (event.deltaY < 0) zoomIn(camera);
        if (event.deltaY > 0) zoomOut(camera);
      }
    }

    // Handle view switching
    if (camera.mode === PlayerCameraMode.Both) {
      if (camera.currentView === PlayerCameraView.FirstPerson) {
        if (camera.targetDistance >= MIN_CAMERA_DISTANCE) {
          camera.currentView = PlayerCameraView.ThirdPerson;
          camera.targetDistance = MIN_CAMERA_DISTANCE;
          camera.distance = MIN_CAMERA_DISTANCE;
        }
      } else if (camera.currentView === PlayerCameraView.ThirdPerson) {
        if (camera.distance < MIN_CAMERA_DISTANCE) {
          camera.currentView = PlayerCameraView.FirstPerson;
        }
      }
    }

    const K = 1 - LERP_STRENGTH ** time.mainDelta;
    camera.distance = lerp(camera.distance, camera.targetDistance, K);
  }
}

function zoomIn(camera: PlayerCamera) {
  camera.targetDistance -= 1;

  // Only clamp distance if we're in third person only mode
  if (camera.mode === PlayerCameraMode.ThirdPerson) {
    clampTargetDistance(camera);
  }
}

function zoomOut(camera: PlayerCamera) {
  camera.targetDistance += 1;
  clampTargetDistance(camera);
}

function clampTargetDistance(camera: PlayerCamera) {
  camera.targetDistance = Math.min(
    MAX_CAMERA_DISTANCE,
    Math.max(MIN_CAMERA_DISTANCE, camera.targetDistance)
  );
}
