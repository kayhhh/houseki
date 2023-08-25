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
  AnimatedCube: "/models/AnimatedCube/AnimatedCube.gltf",
  BoxAnimated: "/models/BoxAnimated.glb",
  Cube: "/models/Cube/Cube.gltf",
  "Damaged Helmet": "/models/DamagedHelmet.glb",
  "Flight Helmet": "/models/FlightHelmet/FlightHelmet.gltf",
  MinecraftVillage: "/models/Minecraft-Village.glb",
  "Texture Transform Test": "/models/TextureTransformMultiTest.glb",
  Tokyo: "/models/tokyo.glb",
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

      <div
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();

          const file = e.dataTransfer.files[0];
          if (!file) return;

          const url = URL.createObjectURL(file);

          selectedModel.uri = url;
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <Canvas />
      </div>
    </>
  );
}
