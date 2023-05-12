import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        basic: resolve("basic/index.html"),
        gltf: resolve("gltf/index.html"),
        main: resolve("index.html"),
      },
    },
    target: "esnext",
  },
  plugins: [
    {
      configureServer: (server) => {
        server.middlewares.use((_req, res, next) => {
          res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
          res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
          next();
        });
      },
      name: "configure-response-headers",
    },
  ],
});
