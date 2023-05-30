import { useEffect, useState } from "react";
import { World } from "thyseus";

import Canvas from "../../components/canvas/Canvas";
import Loading from "../../components/loading/Loading";
import Stats from "../../components/stats/Stats";
import { useEngine } from "../../utils/useEngine";

export default function Player() {
  const [world, setWorld] = useState<World | null>(null);

  useEffect(() => {
    import("./world").then((module) => {
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
