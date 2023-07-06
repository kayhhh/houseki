import { TransformMode } from "lattice-engine/transform";
import { useControls } from "leva";
import { useEffect, useState } from "react";
import { World } from "thyseus";

import Canvas from "../../components/canvas/Canvas";
import Loading from "../../components/loading/Loading";
import Stats from "../../components/stats/Stats";
import { useEngine } from "../../utils/useEngine";
import { transformConfig } from "./systems";

export default function Transform() {
  const [world, setWorld] = useState<World | null>(null);

  useEffect(() => {
    import("./world").then(async (module) => {
      await module.createWorld();
      setWorld(module.world);
    });
  }, []);

  useEngine(world);

  useControls({
    mode: {
      onChange: (value) => {
        switch (value) {
          case "translate": {
            transformConfig.mode = TransformMode.Translate;
            break;
          }
          case "rotate": {
            transformConfig.mode = TransformMode.Rotate;
            break;
          }
          case "scale": {
            transformConfig.mode = TransformMode.Scale;
            break;
          }
        }
      },
      options: ["translate", "rotate", "scale"],
      value: "translate",
    },
  });

  return (
    <>
      <Loading />
      <Stats />
      <Canvas />
    </>
  );
}
