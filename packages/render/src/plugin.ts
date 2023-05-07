import { definePlugin } from "thyseus";

import { canvasRenderer } from "./canvasRenderer";
import { cameraBuilder } from "./systems/cameraBuilder";
import { geometryBuilder } from "./systems/geometryBuilder";
import { meshBuilder } from "./systems/meshBuilder";
import { nodeBuilder } from "./systems/nodeBuilder";
import { sceneBuilder } from "./systems/sceneBuilder";

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
