import { definePlugin } from "thyseus";

import { geometryCleanup, materialCleanup } from "./scene/cleanup";
import {
  Geometry,
  IsScene,
  Mesh,
  Parent,
  PerspectiveCamera,
  Position,
  Rotation,
  Scale,
} from "./scene/components";
import { Resource } from "./warehouse/components";

/**
 * Registers all core components and systems.
 */
export const corePlugin = definePlugin((builder) => {
  builder
    .registerComponent(Resource)
    .registerComponent(Position)
    .registerComponent(Rotation)
    .registerComponent(Scale)
    .registerComponent(Parent)
    .registerComponent(PerspectiveCamera)
    .registerComponent(IsScene)
    .registerComponent(Mesh)
    .registerComponent(Geometry)
    .addSystem(geometryCleanup)
    .addSystem(materialCleanup);
});
