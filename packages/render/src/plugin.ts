import { LatticeSchedules } from "@lattice-engine/core";
import { run, WorldBuilder } from "thyseus";

import { createAmbientLights } from "./systems/createAmbientLights";
import { createAnimationClips } from "./systems/createAnimationClips";
import { createAnimationMixers } from "./systems/createAnimationMixers";
import { createBasicMaterials } from "./systems/createBasicMaterials";
import { createCameras } from "./systems/createCameras";
import { createDirectionalLights } from "./systems/createDirectionalLights";
import { createGeometries } from "./systems/createGeometries";
import { createImages } from "./systems/createImages";
import { createKeyframeTracks } from "./systems/createKeyframeTracks";
import { createLineMaterials } from "./systems/createLineMaterials";
import { createMeshes } from "./systems/createMeshes";
import { createNodes } from "./systems/createNodes";
import { createScenes } from "./systems/createScenes";
import { createShadowMaps } from "./systems/createShadowMaps";
import { createSkybox } from "./systems/createSkybox";
import { createStandardMaterials } from "./systems/createStandardMaterials";
import { playAnimations } from "./systems/playAnimations";
import { renderCanvas } from "./systems/renderCanvas";
import { renderClearPass } from "./systems/renderClearPass";
import { saveAnimations } from "./systems/saveAnimations";

/**
 * Registers all render components and systems.
 */
export function renderPlugin(builder: WorldBuilder) {
  builder
    .addSystems(
      createSkybox,
      ...run.chain(
        createImages,
        [
          createBasicMaterials,
          createStandardMaterials,
          createLineMaterials,
          createGeometries,
        ],
        createMeshes,
        createNodes,
        [createAmbientLights, createDirectionalLights],
        createShadowMaps,
        [createScenes, createCameras],
        createKeyframeTracks,
        createAnimationClips,
        createAnimationMixers,
        playAnimations,
        saveAnimations
      )
    )
    .addSystemsToSchedule(
      LatticeSchedules.Render,
      ...run.chain(renderClearPass, renderCanvas)
    );
}
