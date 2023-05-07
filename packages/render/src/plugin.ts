import { definePlugin } from "thyseus";

import { cameraBuilder } from "./builders/cameraBuilder";
import { geometryBuilder } from "./builders/geometryBuilder";
import { meshBuilder } from "./builders/meshBuilder";
import { nodeBuilder } from "./builders/nodeBuilder";
import { sceneBuilder } from "./builders/sceneBuilder";
import { canvasRenderer } from "./canvasRenderer";

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
