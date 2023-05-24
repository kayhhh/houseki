import { Engine } from "@lattice-engine/core";
import { useEffect } from "react";
import { World } from "thyseus";

export function useEngine(world: World) {
  useEffect(() => {
    const engine = new Engine(world);

    engine.start();

    return () => {
      engine.destroy();
    };
  }, [world]);
}
