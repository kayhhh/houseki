import { definePlugin } from "thyseus";

import { gltfDocumentLoader, gltfLoader } from "./loader/gltfLoader";

export const gltfPlugin = definePlugin((builder) => {
  builder.addSystem(gltfLoader).addSystem(gltfDocumentLoader);
});
