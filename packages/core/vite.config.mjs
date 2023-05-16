import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: resolve("src/index.ts"),
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
  plugins: [dts()],
});
