import { Raycast } from "@lattice-engine/physics";
import {
  PlayerCamera,
  PlayerCameraView,
  TargetRotation,
} from "@lattice-engine/player";
import { RenderStore } from "@lattice-engine/render";
import { Transform } from "@lattice-engine/scene";
import { Vector3 } from "three";
import { Entity, Mut, Query, Res, With } from "thyseus";

import { Portal, PortalRaycast } from "../components";

const vec3_a = new Vector3();
const vec3_b = new Vector3();

export function rotatePlayerCamera(
  renderStore: Res<RenderStore>,
  cameras: Query<
    [
      Entity,
      PlayerCamera,
      Mut<TargetRotation>,
      Mut<Transform>,
      Raycast,
      Mut<PortalRaycast>,
    ]
  >,
  raycasts: Query<[Entity, Raycast]>,
  portals: Query<Entity, With<Portal>>,
) {
  for (const [
    cameraEntity,
    camera,
    targetRotation,
    transform,
    raycast1,
    portalRaycast,
  ] of cameras) {
    if (!portalRaycast.active) continue;

    const cameraObj = renderStore.perspectiveCameras.get(cameraEntity.id);
    if (!cameraObj) continue;

    for (const [raycastEnt, raycast2] of raycasts) {
      if (portalRaycast.raycastId !== raycastEnt.id) continue;

      for (const enterEnt of portals) {
        if (portalRaycast.enterPortalId !== enterEnt.id) continue;

        for (const exitEnt of portals) {
          if (portalRaycast.exitPortalId !== exitEnt.id) continue;

          if (camera.currentView === PlayerCameraView.ThirdPerson) {
            vec3_a.set(raycast2.origin.x, raycast2.origin.y, raycast2.origin.z);

            vec3_b.set(
              -raycast2.direction.x * raycast1.hitToi,
              raycast2.direction.y * raycast1.hitToi,
              raycast2.direction.z * raycast1.hitToi,
            );

            vec3_a.sub(vec3_b);

            cameraObj.lookAt(vec3_a);

            targetRotation.x = cameraObj.quaternion.x;
            targetRotation.y = cameraObj.quaternion.y;
            targetRotation.z = cameraObj.quaternion.z;
            targetRotation.w = cameraObj.quaternion.w;

            // Teleport first frame, don't lerp
            if (portalRaycast.firstFrame) {
              transform.rotation.x = targetRotation.x;
              transform.rotation.y = targetRotation.y;
              transform.rotation.z = targetRotation.z;
              transform.rotation.w = targetRotation.w;
            }
          }
        }
      }
    }
  }
}
