import { run, WorldBuilder } from "thyseus";

import { movePlayer } from "./movePlayer";
import { preparePlayer } from "./preparePlayer";
import { rotatePlayer } from "./rotatePlayer";

export function playerPlugin(builder: WorldBuilder) {
  builder.addSystems(...run.chain(preparePlayer, rotatePlayer, movePlayer));
}
