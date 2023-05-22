import { Engine } from "@lattice-engine/core";
import { useEffect, useState } from "react";

import Canvas from "../../utils/Canvas";
import { world } from "./world";

export default function VRM() {
  const [engine, setEngine] = useState<Engine>();

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

  return <Canvas />;
}
