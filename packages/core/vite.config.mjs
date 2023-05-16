import { exec } from "child_process";
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: resolve("src/index.ts"),
      fileName: "index",
      formats: ["es"],
      name: "core",
    },
    minify: false,
    target: "esnext",
  },
  plugins: [
    {
      buildEnd() {
        exec("tsc --emitDeclarationOnly");
      },
      name: "dts",
    },
  ],
});
