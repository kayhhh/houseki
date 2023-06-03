import { WorldBuilder } from "thyseus";

import { gltfLoader } from "./systems/gltfLoader";

export function gltfPlugin(builder: WorldBuilder) {
  builder.addSystems(gltfLoader);
}
