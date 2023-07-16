import { RenderStore } from "@lattice-engine/render";
import { Parent } from "@lattice-engine/scene";
import { VrmStore } from "@lattice-engine/vrm";
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
  renderStore: Res<RenderStore>,
  avatars: Query<[Entity, Parent], With<PlayerAvatar>>,
  cameras: Query<[PlayerCamera, Parent, Mut<TargetTranslation>]>
) {
  for (const [entity, parent] of avatars) {
    for (const [camera, cameraParent, targetTranslation] of cameras) {
      // Find camera that is attached to the same player body
      if (cameraParent.id !== parent.id) continue;

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

      // Get relative position from body
      const body = renderStore.nodes.get(parent.id);
      if (body) vector3.sub(body.getWorldPosition(vector3b));

      targetTranslation.fromObject(vector3);
    }
  }
}
