import { Engine } from "@lattice-engine/core";
import { gltfPlugin, GltfUri } from "@lattice-engine/gltf";
import { OrbitControls, orbitPlugin } from "@lattice-engine/orbit";
import { renderPlugin, RenderStore } from "@lattice-engine/render";
import {
  Node,
  Parent,
  PerspectiveCamera,
  Position,
  Scene,
  scenePlugin,
} from "@lattice-engine/scene";
import { useControls } from "leva";
import { useEffect, useState } from "react";
import {
  Commands,
  CommandsDescriptor,
  CoreSchedule,
  Mut,
  MutDescriptor,
  Query,
  QueryDescriptor,
  Res,
  ResourceDescriptor,
} from "thyseus";

import Canvas from "../utils/Canvas";

const MODELS = {
  Cube: "/Cube/Cube.gltf",
  "Damaged Helmet": "/DamagedHelmet/DamagedHelmet.glb",
  "Flight Helmet": "/FlightHelmet/FlightHelmet.gltf",
};

// Using a local variable like this will not work with multi-threading
// TODO: Find a better solution
let modelUri = "";

export default function Gltf() {
  const [engine, setEngine] = useState<Engine>();

  const { model } = useControls({
    model: { options: MODELS },
  });

  // Create engine
  useEffect(() => {
    const builder = Engine.createWorld()
      .addPlugin(scenePlugin)
      .addPlugin(renderPlugin)
      .addPlugin(gltfPlugin)
      .addPlugin(orbitPlugin)
      .addSystemsToSchedule(CoreSchedule.Startup, initScene)
      .addSystems(loadGltf);

    builder.build().then((world) => {
      const newEngine = new Engine(world);
      setEngine(newEngine);
    });
  }, []);

  // Run engine
  useEffect(() => {
    if (!engine) return;

    engine.start();

    return () => {
      engine.stop();
    };
  }, [engine]);

  // Update glTF model
  useEffect(() => {
    modelUri = model;
  }, [model]);

  return <Canvas />;
}

/**
 * System to initialize the scene.
 */
function initScene(commands: Commands, store: Res<Mut<RenderStore>>) {
  // Set canvas
  const canvas = document.querySelector("canvas");
  if (!canvas) throw new Error("Canvas not found");
  store.setCanvas(canvas);

  // Create scene
  const scene = commands.spawn().addType(Scene);
  store.activeScene = scene.id;

  // Create camera
  const camera = commands
    .spawn()
    .add(new Position(0, 0, 5))
    .addType(PerspectiveCamera)
    .addType(OrbitControls);
  store.activeCamera = camera.id;

  // Add node to scene with glTF component
  commands.spawn().addType(Node).add(new Parent(scene)).addType(GltfUri);
}

initScene.parameters = [
  CommandsDescriptor(),
  ResourceDescriptor(MutDescriptor(RenderStore)),
];

/**
 * System to update the glTF uri.
 */
function loadGltf(entities: Query<Mut<GltfUri>>) {
  for (const gltf of entities) {
    gltf.uri = modelUri;
  }
}

loadGltf.parameters = [QueryDescriptor(MutDescriptor(GltfUri))];
