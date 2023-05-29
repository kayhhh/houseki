import { corePlugin } from "@lattice-engine/core";
import { inputPlugin } from "@lattice-engine/input";
import { renderPlugin } from "@lattice-engine/render";
import { scenePlugin } from "@lattice-engine/scene";
import { WorldBuilder } from "thyseus";

/**
 * Adds features that most people expect to have in a game engine.
 *
 * Default plugins:
 * - `@lattice-engine/core`
 * - `@lattice-engine/input`
 * - `@lattice-engine/render`
 * - `@lattice-engine/scene`
 */
export function defaultPlugin(builder: WorldBuilder) {
  builder
    .addPlugin(corePlugin)
    .addPlugin(inputPlugin)
    .addPlugin(renderPlugin)
    .addPlugin(scenePlugin);
}
