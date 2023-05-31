import { run, WorldBuilder } from "thyseus";

import { animatePlayer } from "./systems/animatePlayer";
import { applyAvatarOffset } from "./systems/applyAvatarOffset";
import { createAnimations } from "./systems/createAnimations";
import { moveBody } from "./systems/moveBody";
import { moveCamera } from "./systems/moveCamera";
import { rotateAvatar } from "./systems/rotateAvatar";
import { rotateCamera } from "./systems/rotateCamera";
import { setCameraLayers } from "./systems/setCameraLayers";
import { zoomCamera } from "./systems/zoomCamera";

export function playerPlugin(builder: WorldBuilder) {
  builder.addSystems(
    setCameraLayers,
    ...run.chain(
      [zoomCamera, moveBody],
      rotateCamera,
      rotateAvatar,
      applyAvatarOffset,
      moveCamera,
      createAnimations,
      animatePlayer
    )
  );
}
