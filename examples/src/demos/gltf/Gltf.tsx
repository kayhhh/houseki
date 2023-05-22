import { Engine } from "@lattice-engine/core";
import { useControls } from "leva";
import { useEffect, useState } from "react";

import Canvas from "../../utils/Canvas";
import { selectedModel } from "./systems";
import { world } from "./world";

const MODELS = {
  Cube: "/Cube/Cube.gltf",
  "Damaged Helmet": "/DamagedHelmet/DamagedHelmet.glb",
  "Flight Helmet": "/FlightHelmet/FlightHelmet.gltf",
};

export default function Gltf() {
  const [engine, setEngine] = useState<Engine>();

  const { model } = useControls({
    model: { options: MODELS },
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
