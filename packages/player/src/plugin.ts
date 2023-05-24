import { run, WorldBuilder } from "thyseus";

import { applyAvatarOffset } from "./systems/applyAvatarOffset";
import { moveBody } from "./systems/moveBody";
import { moveCamera } from "./systems/moveCamera";
import { zoomCamera } from "./systems/zoomCamera";

export function playerPlugin(builder: WorldBuilder) {
  builder.addSystems(
    ...run.chain([zoomCamera, moveBody], moveCamera, applyAvatarOffset)
  );
}
