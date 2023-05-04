import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        basic: resolve(__dirname, "basic/index.html"),
        main: resolve(__dirname, "index.html"),
      },
    },
    target: "esnext",
  },
});
