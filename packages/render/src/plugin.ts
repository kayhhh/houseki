import { run, WorldBuilder } from "thyseus";

import { canvasRenderer } from "./canvasRenderer";
import { cameraBuilder } from "./scene/cameraBuilder";
import { geometryBuilder } from "./scene/geometryBuilder";
import { materialBuilder } from "./scene/materialBuilder";
import { meshBuilder } from "./scene/meshBuilder";
import { nodeBuilder } from "./scene/nodeBuilder";
import { sceneBuilder } from "./scene/sceneBuilder";

/**
 * Registers all render components and systems.
 */
export function renderPlugin(builder: WorldBuilder) {
  builder.addSystems(
    ...run.chain(
      [materialBuilder, geometryBuilder],
      meshBuilder,
      nodeBuilder,
      [sceneBuilder, cameraBuilder],
      canvasRenderer
    )
  );
}
