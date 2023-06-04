import { WorldBuilder } from "thyseus";

import { createText } from "./systems/createText";

export function textPlugin(builder: WorldBuilder) {
  builder.addSystems(createText);
}
