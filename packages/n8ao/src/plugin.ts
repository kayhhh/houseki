import { WorldBuilder } from "thyseus";

import { addPass } from "./systems/addPass";
import { createPass } from "./systems/createPass";

export function n8aoPlugin(builder: WorldBuilder) {
  builder.addSystems(createPass, addPass);
}
