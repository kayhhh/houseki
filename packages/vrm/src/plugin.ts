import { WorldBuilder } from "thyseus";

import { createAvatars } from "./createAvatars";

export function vrmPlugin(builder: WorldBuilder) {
  builder.addSystems(createAvatars);
}
