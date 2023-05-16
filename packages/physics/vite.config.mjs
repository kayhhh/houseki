import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import wasm from "vite-plugin-wasm";

export default defineConfig({
  build: {
    lib: {
      entry: resolve("src/index.ts"),
      fileName: "index",
      formats: ["es"],
      name: "physics",
    },
    minify: false,
    rollupOptions: {
      external: ["thyseus", "@lattice-engine/core"],
    },
    target: "esnext",
  },
  plugins: [dts(), wasm()],
});
