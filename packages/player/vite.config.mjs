import { thyseusPlugin } from "@thyseus/transformer-rollup";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: "src/index.ts",
      fileName: "index",
      formats: ["es"],
      name: "player",
    },
    minify: false,
    rollupOptions: {
      external: [
        "@lattice-engine/core",
        "@lattice-engine/input",
        "@lattice-engine/physics",
        "@lattice-engine/render",
        "@lattice-engine/scene",
        "@lattice-engine/vrm",
        "three",
        "thyseus",
      ],
    },
    target: "esnext",
  },
  plugins: [dts(), thyseusPlugin()],
});
