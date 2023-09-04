import peerDepsExternal from "rollup-plugin-peer-deps-external";
import { defineConfig } from "vite";
import thyseusTS from "vite-plugin-thyseus-ts";
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
  plugins: [peerDepsExternal(), wasm(), thyseusTS()],
});
