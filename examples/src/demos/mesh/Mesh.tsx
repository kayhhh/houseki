import { useEffect, useState } from "react";
import { World } from "thyseus";

import Canvas from "../../components/canvas/Canvas";
import Loading from "../../components/loading/Loading";
import Stats from "../../components/stats/Stats";
import { useEngine } from "../../utils/useEngine";
import { usePointerLockToggle } from "../../utils/usePointerLockToggle";

export default function Mesh() {
  const [world, setWorld] = useState<World | null>(null);

  useEffect(() => {
    import("./world").then(async (module) => {
      await module.createWorld();
      setWorld(module.world);
    });
  }, []);

  useEngine(world);
  usePointerLockToggle();

  return (
    <>
      <Loading />
      <Stats />
      <Canvas />
    </>
  );
}
