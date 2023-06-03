import { LatticeSchedules } from "@lattice-engine/core";
import { run, WorldBuilder } from "thyseus";

import { canvasRenderer } from "./canvasRenderer";
import { destroy } from "./destroy";
import { createAnimationClips } from "./scene/createAnimationClips";
import { createAnimationMixers } from "./scene/createAnimationMixers";
import { createCameras } from "./scene/createCameras";
import { createGeometries } from "./scene/createGeometries";
import { createImages } from "./scene/createImages";
import { createKeyframeTracks } from "./scene/createKeyframeTracks";
import { createLineMaterials } from "./scene/createLineMaterials";
import { createLineSegments } from "./scene/createLineSegments";
import { createMaterials } from "./scene/createMaterials";
import { createMeshes } from "./scene/createMeshes";
import { createNodes } from "./scene/createNodes";
import { createScenes } from "./scene/createScenes";
import { playAnimations } from "./scene/playAnimations";
import { saveAnimations } from "./scene/saveAnimations";

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
      [createScenes, createCameras],
      createKeyframeTracks,
      createAnimationClips,
      createAnimationMixers,
      playAnimations,
      saveAnimations
    ),
    run(canvasRenderer).last()
  );

  builder.addSystemsToSchedule(LatticeSchedules.Destroy, destroy);
}
