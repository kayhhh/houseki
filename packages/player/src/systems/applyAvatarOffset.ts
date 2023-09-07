import { Parent } from "@reddo/scene";
import { VrmStore } from "@reddo/vrm";
import { Vector3 } from "three";
import { Entity, Mut, Query, Res, With } from "thyseus";

import { PlayerAvatar, PlayerCamera, TargetTranslation } from "../components";
import { PlayerCameraView } from "../types";

const vector3 = new Vector3();
const vector3b = new Vector3();

/**
 * System to apply offset to camera based on avatar position.
 */
export function applyAvatarOffset(
  vrmStore: Res<VrmStore>,
  avatars: Query<[Entity, Parent], With<PlayerAvatar>>,
  cameras: Query<[PlayerCamera, Mut<TargetTranslation>]>
) {
  for (const [camera, targetTranslation] of cameras) {
    let foundAvatar = false;

    for (const [entity, parent] of avatars) {
      // Find avatar that matches the camera body
      if (camera.bodyId !== parent.id) continue;

      foundAvatar = true;

      const vrm = vrmStore.avatars.get(entity.id);
      if (!vrm) continue;

      const leftEye = vrm.humanoid.normalizedHumanBones.leftEye?.node;
      const rightEye = vrm.humanoid.normalizedHumanBones.rightEye?.node;
      const head = vrm.humanoid.normalizedHumanBones.head.node;

      // Get position of head or eyes
      if (camera.currentView === PlayerCameraView.FirstPerson) {
        if (leftEye && rightEye) {
          leftEye
            .getWorldPosition(vector3)
            .add(rightEye.getWorldPosition(vector3b))
            .divideScalar(2);
        } else {
          head.getWorldPosition(vector3);
          vector3.y += 0.1;
        }

        vector3.addScaledVector(head.getWorldDirection(vector3b), -0.15);
      } else {
        head.getWorldPosition(vector3);
      }

      targetTranslation.fromObject(vector3);
    }

    if (!foundAvatar) {
      targetTranslation.set(0, 0, 0);
    }
  }
}
