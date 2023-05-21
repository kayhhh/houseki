import { WorldBuilder } from "thyseus";

import { playerControls } from "./playerControls";

export function playerPlugin(builder: WorldBuilder) {
  builder.addSystems(playerControls);
}
