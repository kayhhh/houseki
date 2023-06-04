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
      name: "n8ao",
    },
    minify: false,
    rollupOptions: {
      external: ["@lattice-engine/render", "@lattice-engine/scene", "thyseus"],
    },
    target: "esnext",
  },
  plugins: [dts(), thyseusPlugin()],
});
