import { WorldBuilder } from "thyseus";

import { geometryCleanup, textureCleanup } from "./cleanup";

export function scenePlugin(builder: WorldBuilder) {
  builder.addSystems(geometryCleanup, textureCleanup);
}
