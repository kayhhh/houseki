import { Engine } from "@lattice-engine/core";
import { useControls } from "leva";
import { useEffect, useState } from "react";

import Canvas from "../../utils/Canvas";
import { selectedModel } from "./systems";
import { world } from "./world";

const MODELS = {
  Cube: "/gltf/Cube/Cube.gltf",
  "Damaged Helmet": "/gltf/DamagedHelmet.glb",
  "Flight Helmet": "/gltf/FlightHelmet/FlightHelmet.gltf",
};

export default function Gltf() {
  const [engine, setEngine] = useState<Engine>();

  const { model } = useControls({
    model: { options: MODELS, value: MODELS["Damaged Helmet"] },
  });

  // Create engine
  useEffect(() => {
    const newEngine = new Engine(world);
    setEngine(newEngine);
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
    selectedModel.uri = model;
  }, [model]);

  return <Canvas />;
}
