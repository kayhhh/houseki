import { run, WorldBuilder } from "thyseus";

import { movePlayer } from "./movePlayer";
import { rotatePlayer } from "./rotatePlayer";

export function playerPlugin(builder: WorldBuilder) {
  builder.addSystems(...run.chain(rotatePlayer, movePlayer));
}
