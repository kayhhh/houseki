import { run, WorldBuilder } from "thyseus";

import { canvasRenderer } from "./canvasRenderer";
import { createCameras } from "./scene/createCameras";
import { createGeometries } from "./scene/createGeometries";
import { createImages } from "./scene/createImages";
import { createMaterials } from "./scene/createMaterials";
import { createMeshes } from "./scene/createMeshes";
import { createNodes } from "./scene/createNodes";
import { createScenes } from "./scene/createScenes";

/**
 * Registers all render components and systems.
 */
export function renderPlugin(builder: WorldBuilder) {
  builder.addSystems(
    ...run.chain(
      createImages,
      [createMaterials, createGeometries],
      createMeshes,
      createNodes,
      [createScenes, createCameras],
      canvasRenderer
    )
  );
}
