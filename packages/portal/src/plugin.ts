import { LatticeSchedules } from "@lattice-engine/core";
import { renderCanvas } from "@lattice-engine/render";
import { run, WorldBuilder } from "thyseus";

import { createPortalMaterials } from "./systems/createPortalMaterials";
import { renderPortals } from "./systems/renderPortals";

export function portalPlugin(builder: WorldBuilder) {
  builder
    .addSystems(createPortalMaterials)
    .addSystemsToSchedule(
      LatticeSchedules.Render,
      run(renderPortals).before(renderCanvas)
    );
}
