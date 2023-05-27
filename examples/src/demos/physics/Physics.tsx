import { useEffect, useState } from "react";
import { World } from "thyseus";

import Canvas from "../../utils/Canvas";
import { useEngine } from "../../utils/useEngine";

export default function Physics() {
  const [world, setWorld] = useState<World | null>(null);

  useEffect(() => {
    import("./world").then((module) => {
      setWorld(module.world);
    });
  }, []);

  useEngine(world);

  return <Canvas />;
}
