import { run, WorldBuilder } from "thyseus";

import { moveBody } from "./moveBody";
import { moveCamera } from "./moveCamera";
import { zoomCamera } from "./zoomCamera";

export function playerPlugin(builder: WorldBuilder) {
  builder.addSystems(...run.chain([zoomCamera, moveBody], moveCamera));
}
