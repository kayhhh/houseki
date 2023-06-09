import { useControls } from "leva";
import { useEffect, useState } from "react";
import { World } from "thyseus";

import Canvas from "../../components/canvas/Canvas";
import Loading from "../../components/loading/Loading";
import { useLoadingStore } from "../../components/loading/system";
import Stats from "../../components/stats/Stats";
import { useEngine } from "../../utils/useEngine";
import { selectedModel } from "./systems";

const MODELS = {
  AnimatedCube: "/gltf/AnimatedCube/AnimatedCube.gltf",
  BoxAnimated: "/gltf/BoxAnimated.glb",
  Cube: "/gltf/Cube/Cube.gltf",
  "Damaged Helmet": "/gltf/DamagedHelmet.glb",
  "Flight Helmet": "/gltf/FlightHelmet/FlightHelmet.gltf",
  MinecraftVillage: "/gltf/Minecraft-Village.glb",
  "Texture Transform Test": "/gltf/TextureTransformMultiTest.glb",
  Tokyo: "/gltf/tokyo.glb",
};

export default function Gltf() {
  const [world, setWorld] = useState<World | null>(null);
  useEngine(world);

  useEffect(() => {
    import("./world").then(async (module) => {
      await module.createWorld();
      setWorld(module.world);
    });
  }, []);

  const { model } = useControls({
    model: { options: MODELS, value: MODELS["Damaged Helmet"] },
  });

  // Update glTF model
  useEffect(() => {
    selectedModel.uri = model;

    return () => {
      useLoadingStore.getState().reset();
    };
  }, [model]);

  return (
    <>
      <Loading />
      <Stats />
      <Canvas />
    </>
  );
}
