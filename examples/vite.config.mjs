import { resolve } from "path";
import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        basic: resolve("basic/index.html"),
        gltf: resolve("gltf/index.html"),
        main: resolve("index.html"),
        physics: resolve("physics/index.html"),
      },
    },
    target: "esnext",
  },
  plugins: [
    // WASM required for physics
    wasm(),

    // Cross Origin Isolation required for multi-threading
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
