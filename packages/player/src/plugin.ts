import { run, WorldBuilder } from "thyseus";

import { applyAvatarOffset } from "./systems/applyAvatarOffset";
import { moveBody } from "./systems/moveBody";
import { moveCamera } from "./systems/moveCamera";
import { rotateAvatar } from "./systems/rotateAvatar";
import { setCameraLayers } from "./systems/setCameraLayers";
import { zoomCamera } from "./systems/zoomCamera";

export function playerPlugin(builder: WorldBuilder) {
  builder.addSystems(
    setCameraLayers,
    ...run.chain(
      [zoomCamera, moveBody],
      moveCamera,
      rotateAvatar,
      applyAvatarOffset
    )
  );
}
