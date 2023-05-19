import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: resolve("src/index.ts"),
      fileName: "index",
      formats: ["es"],
      name: "gltf",
    },
    minify: false,
    rollupOptions: {
      external: ["thyseus", "@lattice-engine/core"],
    },
    target: "esnext",
  },
  plugins: [dts()],
});
