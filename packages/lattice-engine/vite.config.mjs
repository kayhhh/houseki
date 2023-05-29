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
        orbit: "./src/orbit.ts",
        physics: "./src/physics.ts",
        player: "./src/player.ts",
        render: "./src/render.ts",
        scene: "./src/scene.ts",
        vrm: "./src/vrm.ts",
      },
      formats: ["es"],
    },
    minify: false,
    rollupOptions: {
      external: [
        "@lattice-engine/core",
        "@lattice-engine/gltf",
        "@lattice-engine/input",
        "@lattice-engine/orbit",
        "@lattice-engine/physics",
        "@lattice-engine/player",
        "@lattice-engine/render",
        "@lattice-engine/scene",
        "@lattice-engine/vrm",
        "thyseus",
      ],
    },
    target: "esnext",
  },
  plugins: [dts()],
});
