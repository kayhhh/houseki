import { definePlugin } from "thyseus";

import { canvasRenderer } from "./canvasRenderer";
import { cameraBuilder } from "./scene/cameraBuilder";
import { geometryBuilder } from "./scene/geometryBuilder";
import { meshBuilder } from "./scene/meshBuilder";
import { nodeBuilder } from "./scene/nodeBuilder";
import { sceneBuilder } from "./scene/sceneBuilder";

/**
 * Registers all render components and systems.
 */
export const renderPlugin = definePlugin((builder) => {
  builder
    .addSystem(canvasRenderer)
    .addSystem(cameraBuilder.before(canvasRenderer))
    .addSystem(sceneBuilder.before(canvasRenderer))
    .addSystem(nodeBuilder.before(sceneBuilder))
    .addSystem(meshBuilder.before(nodeBuilder))
    .addSystem(geometryBuilder.before(meshBuilder));
});
