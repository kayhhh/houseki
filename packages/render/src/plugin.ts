import { LatticeSchedules } from "@lattice-engine/core";
import { run, WorldBuilder } from "thyseus";

import { clearScene } from "./systems/clearScene";
import { createAmbientLights } from "./systems/createAmbientLights";
import { createAnimationClips } from "./systems/createAnimationClips";
import { createAnimationMixers } from "./systems/createAnimationMixers";
import { createCameras } from "./systems/createCameras";
import { createDirectionalLights } from "./systems/createDirectionalLights";
import { createGeometries } from "./systems/createGeometries";
import { createImages } from "./systems/createImages";
import { createKeyframeTracks } from "./systems/createKeyframeTracks";
import { createLineMaterials } from "./systems/createLineMaterials";
import { createLineSegments } from "./systems/createLineSegments";
import { createMaterials } from "./systems/createMaterials";
import { createMeshes } from "./systems/createMeshes";
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
  builder.addSystems(
    ...run.chain(
      createImages,
      [createMaterials, createLineMaterials, createGeometries],
      [createMeshes, createLineSegments],
      createNodes,
      [createAmbientLights, createDirectionalLights],
      createShadowMaps,
      [createScenes, createCameras],
      createKeyframeTracks,
      createAnimationClips,
      createAnimationMixers,
      playAnimations,
      saveAnimations
    ),
    run(renderCanvas).last()
  );

  builder.addSystemsToSchedule(LatticeSchedules.Destroy, clearScene);
}
