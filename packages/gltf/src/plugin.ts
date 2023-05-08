import { definePlugin } from "thyseus";

import { gltfCleanup } from "./loader/gltfCleanup";
import { gltfLoader } from "./loader/gltfLoader";

export const gltfPlugin = definePlugin((builder) => {
  builder.addSystem(gltfLoader).addSystem(gltfCleanup);
});
