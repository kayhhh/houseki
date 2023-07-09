import { LatticeSchedules } from "@lattice-engine/core";
import { run, WorldBuilder } from "thyseus";

import { createAmbientLights } from "./systems/createAmbientLights";
import { createAnimationClips } from "./systems/createAnimationClips";
import { createAnimationMixers } from "./systems/createAnimationMixers";
import { createCameras } from "./systems/createCameras";
import { createDirectionalLights } from "./systems/createDirectionalLights";
import { createGeometries } from "./systems/createGeometries";
import { createImages } from "./systems/createImages";
import { createKeyframeTracks } from "./systems/createKeyframeTracks";
import { createLineMaterials } from "./systems/createLineMaterials";
import { createMeshBasicMaterials } from "./systems/createMeshBasicMaterials";
import { createMeshes } from "./systems/createMeshes";
import { createMeshStandardMaterials } from "./systems/createMeshStandardMaterials";
import { createNodes } from "./systems/createNodes";
import { createScenes } from "./systems/createScenes";
import { createShadowMaps } from "./systems/createShadowMaps";
import { playAnimations } from "./systems/playAnimations";
import { renderCanvas } from "./systems/renderCanvas";
import { saveAnimations } from "./systems/saveAnimations";

/**
 * Registers all render components and systems.
 */
export function renderPlugin(builder: WorldBuilder) {
  builder
    .addSystems(
      ...run.chain(
        createImages,
        [
          createMeshBasicMaterials,
          createMeshStandardMaterials,
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
        saveAnimations,
      ),
    )
    .addSystemsToSchedule(LatticeSchedules.Render, renderCanvas);
}
