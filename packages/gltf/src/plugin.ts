import { WorldBuilder } from "thyseus";

import { gltfLoader } from "./loader/gltfLoader";

export function gltfPlugin(builder: WorldBuilder) {
  builder.addSystems(gltfLoader);
}
