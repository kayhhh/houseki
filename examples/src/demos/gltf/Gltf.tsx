import { useControls } from "leva";
import { useEffect, useState } from "react";
import { World } from "thyseus";

import Canvas from "../../components/canvas/Canvas";
import Stats from "../../components/stats/Stats";
import { useEngine } from "../../utils/useEngine";
import { selectedModel } from "./systems";

const MODELS = {
  AnimatedCube: "/gltf/AnimatedCube/AnimatedCube.gltf",
  BoxAnimated: "/gltf/BoxAnimated.glb",
  Cube: "/gltf/Cube/Cube.gltf",
  "Damaged Helmet": "/gltf/DamagedHelmet.glb",
  "Flight Helmet": "/gltf/FlightHelmet/FlightHelmet.gltf",
};

export default function Gltf() {
  const [world, setWorld] = useState<World | null>(null);

  useEffect(() => {
    import("./world").then((module) => {
      setWorld(module.world);
    });
  }, []);

  useEngine(world);

  const { model } = useControls({
    model: { options: MODELS, value: MODELS["Damaged Helmet"] },
  });

  // Update glTF model
  useEffect(() => {
    selectedModel.uri = model;
  }, [model]);

  return (
    <>
      <Stats />
      <Canvas />
    </>
  );
}
