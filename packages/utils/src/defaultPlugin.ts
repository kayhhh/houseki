import { corePlugin } from "@houseki-engine/core";
import { inputPlugin } from "@houseki-engine/input";
import { renderPlugin } from "@houseki-engine/render";
import { scenePlugin } from "@houseki-engine/scene";
import { WorldBuilder } from "thyseus";

/**
 * Adds features that most people expect to have in a game engine.
 *
 * Default plugins:
 * - `@houseki-engine/core`
 * - `@houseki-engine/input`
 * - `@houseki-engine/render`
 * - `@houseki-engine/scene`
 */
export function defaultPlugin(builder: WorldBuilder) {
  builder
    .addPlugin(corePlugin)
    .addPlugin(inputPlugin)
    .addPlugin(renderPlugin)
    .addPlugin(scenePlugin);
}
