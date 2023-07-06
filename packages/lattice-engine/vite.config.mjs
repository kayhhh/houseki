import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: {
        core: "./src/core.ts",
        gltf: "./src/gltf.ts",
        input: "./src/input.ts",
        n8ao: "./src/n8ao.ts",
        orbit: "./src/orbit.ts",
        physics: "./src/physics.ts",
        player: "./src/player.ts",
        portal: "./src/portal.ts",
        render: "./src/render.ts",
        scene: "./src/scene.ts",
        text: "./src/text.ts",
        transform: "./src/transform.ts",
        utils: "./src/utils.ts",
        vrm: "./src/vrm.ts",
      },
      formats: ["es"],
    },
    minify: false,
    rollupOptions: {
      external: ["three", "thyseus"],
    },
    target: "esnext",
  },
  plugins: [dts()],
});
