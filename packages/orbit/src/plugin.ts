import { WorldBuilder } from "thyseus";

import { inputHandler } from "./inputHandler";
import { orbitControls } from "./orbitControls";

export function orbitPlugin(builder: WorldBuilder) {
  builder.addSystems(inputHandler, orbitControls);
}
