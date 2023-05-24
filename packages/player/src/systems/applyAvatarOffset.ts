import { RenderStore } from "@lattice-engine/render";
import { Parent, Position } from "@lattice-engine/scene";
import { VrmStore } from "@lattice-engine/vrm";
import { Vector3 } from "three";
import { Entity, Mut, Query, Res, With } from "thyseus";

import { PlayerAvatar, PlayerCamera } from "../components";

const vector3 = new Vector3();
const vector3b = new Vector3();

/**
 * System to apply offset to camera based on avatar position.
 */
export function applyAvatarOffset(
  vrmStore: Res<VrmStore>,
  renderStore: Res<RenderStore>,
  avatars: Query<[Entity, Parent], With<PlayerAvatar>>,
  cameras: Query<[Parent, Mut<Position>], With<PlayerCamera>>
) {
  for (const [entity, parent] of avatars) {
    const vrm = vrmStore.avatars.get(entity.id);
    if (!vrm) continue;

    const leftEye = vrm.humanoid.normalizedHumanBones.leftEye?.node;
    const rightEye = vrm.humanoid.normalizedHumanBones.rightEye?.node;
    const head = vrm.humanoid.normalizedHumanBones.head.node;

    // Get world position of eyes or head
    if (leftEye && rightEye) {
      leftEye
        .getWorldPosition(vector3)
        .add(rightEye.getWorldPosition(vector3b))
        .divideScalar(2);
    } else {
      head.getWorldPosition(vector3);

      // Apply an offset to head position, estimating the eye position
      head.getWorldDirection(vector3b);
      vector3.addScaledVector(vector3b, -0.1);
      vector3.y += 0.1;
    }

    // Get relative position from body
    const body = renderStore.nodes.get(parent.id);
    if (body) vector3.sub(body.getWorldPosition(vector3b));

    // Find camera that is attached to the same player body
    for (const [cameraParent, cameraPosition] of cameras) {
      if (cameraParent.id !== parent.id) continue;

      cameraPosition.x += vector3.x;
      cameraPosition.y += vector3.y;
      cameraPosition.z += vector3.z;
    }
  }
}
