import { LatticeSchedules } from "@lattice-engine/core";
import { renderCanvas } from "@lattice-engine/render";
import { run, WorldBuilder } from "thyseus";

import { createPortalMaterials } from "./systems/createPortalMaterials";
import { createPortals } from "./systems/createPortals";
import { renderPortalMaterials } from "./systems/renderPortalMaterials";
import { setPortalRaycasts } from "./systems/setPortalRaycasts";

export function portalPlugin(builder: WorldBuilder) {
  builder
    .addSystems(createPortalMaterials, createPortals)
    .addSystemsToSchedule(LatticeSchedules.PostFixedUpdate, setPortalRaycasts)
    .addSystemsToSchedule(
      LatticeSchedules.Render,
      run(renderPortalMaterials).before(renderCanvas)
    );
}
