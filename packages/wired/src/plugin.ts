import { WorldBuilder } from "thyseus";

import { loadWorldModels } from "./systems/loadWorldModels";

export function wiredPlugin(builder: WorldBuilder) {
  builder.addSystems(loadWorldModels);
}
