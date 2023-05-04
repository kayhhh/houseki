import { Engine } from "@lattice-engine/core";
import { GltfUri } from "@lattice-engine/gltf";

// Create canvas
const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

// Create engine
const engine = await Engine.create(canvas);

// Start the game loop
await engine.start();

// Load gltf model
engine.world.createEntity(GltfUri, { uri: "/public/cube/Cube.gltf" });
