import { useEffect, useState } from "react";
import { World } from "thyseus";

import Canvas from "../../components/canvas/Canvas";
import Loading from "../../components/loading/Loading";
import Stats from "../../components/stats/Stats";
import { useEngine } from "../../utils/useEngine";

export default function Transform() {
  const [world, setWorld] = useState<World | null>(null);

  useEffect(() => {
    import("./world").then(async (module) => {
      await module.createWorld();
      setWorld(module.world);
    });
  }, []);

  useEngine(world);

  return (
    <>
      <Loading />
      <Stats />
      <Canvas />
    </>
  );
}
