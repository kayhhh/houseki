import { thyseusPlugin } from "@thyseus/transformer-rollup";
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
      name: "orbit",
    },
    minify: false,
    rollupOptions: {
      external: [
        "@lattice-engine/input",
        "@lattice-engine/render",
        "@lattice-engine/scene",
        "three",
        "thyseus",
      ],
    },
    target: "esnext",
  },
  plugins: [dts(), thyseusPlugin()],
});
