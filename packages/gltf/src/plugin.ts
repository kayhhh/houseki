import { WorldBuilder } from "thyseus";

import { gltfCleanup } from "./loader/gltfCleanup";
import { gltfLoader } from "./loader/gltfLoader";

export function gltfPlugin(builder: WorldBuilder) {
  builder.addSystems(gltfLoader, gltfCleanup);
}
