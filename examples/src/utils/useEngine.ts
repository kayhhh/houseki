import { Engine } from "lattice-engine/core";
import { buttonGroup, useControls } from "leva";
import { useCallback, useEffect, useState } from "react";
import { World } from "thyseus";

import { cleanupMaterials } from "./createBox";
import { exportConfig, ExportSchedule } from "./export";

export function useEngine(world: World | null) {
  const [engine, setEngine] = useState<Engine | null>(null);

  useEffect(() => {
    if (!world) return;

    const newEngine = new Engine(world);
    setEngine(newEngine);

    newEngine.start();

    return () => {
      setEngine(null);
      newEngine.destroy();
      cleanupMaterials();
    };
  }, [world]);

  const exportScene = useCallback(() => {
    if (!engine) return;
    engine.queueSchedule(ExportSchedule);
  }, [engine]);

  useControls(
    {
      export: buttonGroup({
        glb: () => {
          exportConfig.format = "binary";
          exportConfig.mode = "download";
          exportScene();
        },
        gltf: () => {
          exportConfig.format = "json";
          exportConfig.mode = "download";
          exportScene();
        },
        log: () => {
          exportConfig.format = "json";
          exportConfig.mode = "log";
          exportScene();
        },
        test: () => {
          exportConfig.mode = "test";
          exportConfig.format = "binary";
          exportScene();
        },
      }),
    },
    [exportScene],
  );

  return engine;
}
