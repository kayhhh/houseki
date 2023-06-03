import { run, WorldBuilder } from "thyseus";

import { inputWriter } from "./systems/inputWriter";

export function inputPlugin(builder: WorldBuilder) {
  builder.addSystems(run(inputWriter).first());
}
