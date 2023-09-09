import { GlobalTransform, Parent } from "@houseki-engine/scene";
import { VrmStore } from "@houseki-engine/vrm";
import { Vector3 } from "three";
import { Entity, Mut, Query, Res, With } from "thyseus";

import { PlayerAvatar, PlayerCamera, TargetTranslation } from "../components";
import { PlayerCameraView } from "../types";

const vec3 = new Vector3();
const vec3b = new Vector3();

/**
 * System to apply offset to camera based on avatar position.
 */
export function applyAvatarOffset(
  vrmStore: Res<VrmStore>,
  avatars: Query<[Entity, Parent, GlobalTransform], With<PlayerAvatar>>,
  cameras: Query<[PlayerCamera, Mut<TargetTranslation>]>
) {
  for (const [camera, targetTranslation] of cameras) {
    targetTranslation.set(0, 0, 0);

    for (const [entity, parent, globalTransform] of avatars) {
      // Find avatar that matches the camera body
      if (camera.bodyId !== parent.id) continue;

      const vrm = vrmStore.avatars.get(entity.id);

      if (!vrm) {
        vec3.set(
          globalTransform.translation.x,
          globalTransform.translation.y + 0.1,
          globalTransform.translation.z
        );
      } else {
        const leftEye = vrm.humanoid.normalizedHumanBones.leftEye?.node;
        const rightEye = vrm.humanoid.normalizedHumanBones.rightEye?.node;
        const head = vrm.humanoid.normalizedHumanBones.head.node;

        // Get position of head or eyes
        if (camera.currentView === PlayerCameraView.FirstPerson) {
          if (leftEye && rightEye) {
            leftEye
              .getWorldPosition(vec3)
              .add(rightEye.getWorldPosition(vec3b))
              .divideScalar(2);
          } else {
            head.getWorldPosition(vec3);
            vec3.y += 0.1;
          }

          vec3.addScaledVector(head.getWorldDirection(vec3b), -0.15);
        } else {
          head.getWorldPosition(vec3);
        }
      }

      targetTranslation.fromObject(vec3);
    }
  }
}
