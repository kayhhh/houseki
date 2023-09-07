import { corePlugin } from "@reddo/core";
import { inputPlugin } from "@reddo/input";
import { renderPlugin } from "@reddo/render";
import { scenePlugin } from "@reddo/scene";
import { WorldBuilder } from "thyseus";

/**
 * Adds features that most people expect to have in a game engine.
 *
 * Default plugins:
 * - `@reddo/core`
 * - `@reddo/input`
 * - `@reddo/render`
 * - `@reddo/scene`
 */
export function defaultPlugin(builder: WorldBuilder) {
  builder
    .addPlugin(corePlugin)
    .addPlugin(inputPlugin)
    .addPlugin(renderPlugin)
    .addPlugin(scenePlugin);
}
