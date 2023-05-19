import { WorldBuilder } from "thyseus";

import { geometryCleanup, materialCleanup } from "./cleanup";
import {
  Geometry,
  IsScene,
  Mesh,
  Parent,
  PerspectiveCamera,
  Position,
  Rotation,
  Scale,
} from "./components";

export function scenePlugin(builder: WorldBuilder) {
  builder
    .registerComponent(Position)
    .registerComponent(Rotation)
    .registerComponent(Scale)
    .registerComponent(Parent)
    .registerComponent(PerspectiveCamera)
    .registerComponent(IsScene)
    .registerComponent(Mesh)
    .registerComponent(Geometry)
    .addSystems(geometryCleanup, materialCleanup);
}
