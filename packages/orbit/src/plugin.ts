import { WorldBuilder } from "thyseus";

import { orbitControls } from "./systems/orbitControls";

export function orbitPlugin(builder: WorldBuilder) {
  builder.addSystems(orbitControls);
}
