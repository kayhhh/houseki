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
      name: "gltf",
    },
    minify: false,
    rollupOptions: {
      external: [
        "@lattice-engine/core",
        "@lattice-engine/physics",
        "@lattice-engine/scene",
        "@lattice-engine/text",
        "thyseus",
      ],
    },
    target: "esnext",
  },
  plugins: [dts(), thyseusPlugin()],
});
