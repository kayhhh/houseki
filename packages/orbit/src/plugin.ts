import { WorldBuilder } from "thyseus";

import { orbitControls } from "./orbitControls";

export function orbitPlugin(builder: WorldBuilder) {
  builder.addSystems(orbitControls);
}
