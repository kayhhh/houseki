import { thyseusPlugin } from "@thyseus/transformer-rollup";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
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
    },
    minify: false,
    target: "esnext",
  },
  plugins: [dts(), peerDepsExternal(), thyseusPlugin(), wasm()],
});
