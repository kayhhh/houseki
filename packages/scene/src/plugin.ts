import { WorldBuilder } from "thyseus";

import { geometryCleanup, materialCleanup } from "./cleanup";
import {
  Geometry,
  Mesh,
  Parent,
  PerspectiveCamera,
  Position,
  Rotation,
  Scale,
  Scene,
} from "./components";

export function scenePlugin(builder: WorldBuilder) {
  builder
    .registerComponent(Position)
    .registerComponent(Rotation)
    .registerComponent(Scale)
    .registerComponent(Parent)
    .registerComponent(PerspectiveCamera)
    .registerComponent(Scene)
    .registerComponent(Mesh)
    .registerComponent(Geometry)
    .addSystems(geometryCleanup, materialCleanup);
}
