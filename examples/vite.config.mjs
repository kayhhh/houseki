import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        basic: resolve("basic/index.html"),
        gltf: resolve("gltf/index.html"),
        main: resolve("index.html"),
      },
    },
    target: "esnext",
  },
});
