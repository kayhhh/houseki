import { WorldBuilder } from "thyseus";

import { createAnimations } from "./systems/createAnimations";
import { createAvatars } from "./systems/createAvatars";
import { playAnimations } from "./systems/playAnimations";
import { updateAvatars } from "./systems/updateAvatars";

export function vrmPlugin(builder: WorldBuilder) {
  builder.addSystems(
    createAvatars,
    createAnimations,
    updateAvatars,
    playAnimations,
  );
}
