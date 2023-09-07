import { Time } from "@houseki-engine/core";
import { Transform } from "@houseki-engine/scene";
import { Quaternion } from "three";
import { Mut, Query, Res } from "thyseus";

import { PlayerCamera, TargetRotation } from "../components";
import { PlayerCameraView } from "../types";

const FIRST_PERSON_SLERP = 1e-17;
const THIRD_PERSON_SLERP = 1e-13;

const quaternion = new Quaternion();
const quaternion2 = new Quaternion();

export function slerpCameraRotation(
  time: Res<Time>,
  cameras: Query<[PlayerCamera, Mut<Transform>, TargetRotation]>
) {
  for (const [camera, transform, target] of cameras) {
    quaternion2.set(target.x, target.y, target.z, target.w);

    const slerpFactor =
      camera.currentView === PlayerCameraView.FirstPerson
        ? FIRST_PERSON_SLERP
        : THIRD_PERSON_SLERP;

    const K = 1 - Math.pow(slerpFactor, time.mainDelta);

    quaternion
      .set(
        transform.rotation.x,
        transform.rotation.y,
        transform.rotation.z,
        transform.rotation.w
      )
      .slerp(quaternion2, K);

    transform.rotation.fromObject(quaternion);
  }
}
