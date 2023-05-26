import { useControls } from "leva";
import { useEffect } from "react";

import Canvas from "../../utils/Canvas";
import { useEngine } from "../../utils/useEngine";
import { selectedModel } from "./systems";
import { world } from "./world";

const MODELS = {
  AnimatedCube: "/gltf/AnimatedCube/AnimatedCube.gltf",
  BoxAnimated: "/gltf/BoxAnimated.glb",
  Cube: "/gltf/Cube/Cube.gltf",
  "Damaged Helmet": "/gltf/DamagedHelmet.glb",
  "Flight Helmet": "/gltf/FlightHelmet/FlightHelmet.gltf",
};

export default function Gltf() {
  useEngine(world);

  const { model } = useControls({
    model: { options: MODELS, value: MODELS["BoxAnimated"] },
  });

  // Update glTF model
  useEffect(() => {
    selectedModel.uri = model;
  }, [model]);

  return <Canvas />;
}
