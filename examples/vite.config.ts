import { thyseus } from "@thyseus/rollup-plugin-thyseus";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";

export default defineConfig({
  build: {
    minify: false,
    target: "esnext",
  },
  plugins: [
    react(),
    wasm(),
    thyseus(),
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
