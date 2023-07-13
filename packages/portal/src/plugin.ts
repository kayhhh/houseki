import { LatticeSchedules } from "@lattice-engine/core";
import {
  lerpTargetTranslation,
  slerpTargetRotation,
} from "@lattice-engine/player";
import { renderCanvas, renderClearPass } from "@lattice-engine/render";
import { updateGlobalTransforms } from "@lattice-engine/scene";
import { run, WorldBuilder } from "thyseus";

import { createPortals } from "./systems/createPortals";
import { initPortalRaycasts } from "./systems/initPortalRaycasts";
import { lerpTargetTranslation2 } from "./systems/lerpTargetTranslation2";
import { movePlayerCamera } from "./systems/movePlayerCamera";
import { renderPortalMaterials } from "./systems/renderPortalMaterials";
import { restoreOriginalRotation } from "./systems/restoreOriginalRotation";
import { restoreOriginalTranslation } from "./systems/restoreOriginalTranslation";
import { rotatePlayerCamera } from "./systems/rotatePlayerCamera";
import { saveOriginalRotation } from "./systems/saveOriginalRotation";
import { saveOriginalTranslation } from "./systems/saveOriginalTranslation";
import { setPortalRaycasts } from "./systems/setPortalRaycasts";
import { slerpTargetRotation2 } from "./systems/slerpTargetRotation2";

export function portalPlugin(builder: WorldBuilder) {
  builder
    .addSystems(
      createPortals,
      initPortalRaycasts,

      run(saveOriginalTranslation).after(lerpTargetTranslation),
      run(movePlayerCamera).after(saveOriginalTranslation),
      run(lerpTargetTranslation2).after(movePlayerCamera),

      run(saveOriginalRotation).after(slerpTargetRotation),
      run(rotatePlayerCamera).after(saveOriginalRotation),
      run(slerpTargetRotation2).after(rotatePlayerCamera)
    )
    .addSystemsToSchedule(
      LatticeSchedules.PreUpdate,
      run(restoreOriginalTranslation).before(updateGlobalTransforms),
      run(restoreOriginalRotation).before(updateGlobalTransforms)
    )
    .addSystemsToSchedule(LatticeSchedules.PostFixedUpdate, setPortalRaycasts)
    .addSystemsToSchedule(
      LatticeSchedules.Render,
      run(renderPortalMaterials).after(renderClearPass).before(renderCanvas)
    );
}
