import { Engine } from "@lattice-engine/core";
import { inputPlugin } from "@lattice-engine/input";
import { orbitPlugin } from "@lattice-engine/orbit";
import { physicsPlugin } from "@lattice-engine/physics";
import { renderPlugin } from "@lattice-engine/render";
import { scenePlugin } from "@lattice-engine/scene";
import { useEffect, useState } from "react";
import { CoreSchedule } from "thyseus";

import Canvas from "../../utils/Canvas";
import { initScene } from "./systems";

export default function Physics() {
  const [engine, setEngine] = useState<Engine>();

  // Create engine
  useEffect(() => {
    const builder = Engine.createWorld()
      .addPlugin(inputPlugin)
      .addPlugin(scenePlugin)
      .addPlugin(renderPlugin)
      .addPlugin(orbitPlugin)
      .addPlugin(physicsPlugin)
      .addSystemsToSchedule(CoreSchedule.Startup, initScene);

    builder.build().then((world) => {
      const newEngine = new Engine(world);
      setEngine(newEngine);
    });
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
