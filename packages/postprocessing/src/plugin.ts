import { LatticeSchedules } from "@lattice-engine/core";
import { run, WorldBuilder } from "thyseus";

import { addEffectPass } from "./systems/addEffectPass";
import { addN8aoPass } from "./systems/addN8aoPass";
import { createN8aoPass } from "./systems/createN8aoPass";
import { createOutlineEffects } from "./systems/createOutlineEffects";

export function postprocessingPlugin(builder: WorldBuilder) {
  builder.addSystemsToSchedule(
    LatticeSchedules.PostUpdate,
    ...run.chain(
      [createOutlineEffects, createN8aoPass],
      [addEffectPass, addN8aoPass],
    ),
  );
}
