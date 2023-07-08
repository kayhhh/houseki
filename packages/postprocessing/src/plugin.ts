import { LatticeSchedules } from "@lattice-engine/core";
import { run, WorldBuilder } from "thyseus";

import { addEffectPass } from "./systems/addEffectPass";
import { createOutlineEffects } from "./systems/createOutlineEffects";

export function postprocessingPlugin(builder: WorldBuilder) {
  builder.addSystemsToSchedule(
    LatticeSchedules.PostUpdate,
    run(createOutlineEffects).before(addEffectPass),
    addEffectPass
  );
}
