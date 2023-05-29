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
      name: "core",
    },
    minify: false,
    rollupOptions: {
      external: ["thyseus"],
    },
    target: "esnext",
  },
  plugins: [dts(), thyseusPlugin()],
});
