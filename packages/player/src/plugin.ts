import { LatticeSchedules } from "@lattice-engine/core";
import { run, WorldBuilder } from "thyseus";

import { animatePlayer } from "./systems/animatePlayer";
import { applyAvatarOffset } from "./systems/applyAvatarOffset";
import { createAnimations } from "./systems/createAnimations";
import { lerpTargetTranslation } from "./systems/lerpTargetTranslation";
import { moveBody } from "./systems/moveBody";
import { moveCamera } from "./systems/moveCamera";
import { rotateBody } from "./systems/rotateBody";
import { rotateCamera } from "./systems/rotateCamera";
import { setAirTime } from "./systems/setAirTime";
import { setCameraLayers } from "./systems/setCameraLayers";
import { slerpCameraRotation } from "./systems/slerpCameraRotation";
import { zoomCamera } from "./systems/zoomCamera";

export function playerPlugin(builder: WorldBuilder) {
  builder
    .addSystems(
      createAnimations,
      setCameraLayers,
      ...run.chain(
        zoomCamera,
        rotateCamera,
        slerpCameraRotation,
        applyAvatarOffset,
        moveCamera,
        lerpTargetTranslation,
        rotateBody,
        animatePlayer
      )
    )
    .addSystemsToSchedule(LatticeSchedules.FixedUpdate, moveBody, setAirTime);
}
