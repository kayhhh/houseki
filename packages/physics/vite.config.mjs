import { thyseusPlugin } from "@thyseus/transformer-rollup";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import wasm from "vite-plugin-wasm";

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: "src/index.ts",
      fileName: "index",
      formats: ["es"],
      name: "physics",
    },
    minify: false,
    rollupOptions: {
      external: ["@lattice-engine/core", "@lattice-engine/scene", "thyseus"],
    },
    target: "esnext",
  },
  plugins: [dts(), wasm(), thyseusPlugin()],
});
