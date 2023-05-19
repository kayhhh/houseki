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
      external: ["@lattice-engine/core", "@lattice-engine/scene", "thyseus"],
    },
    target: "esnext",
  },
  plugins: [dts()],
});
