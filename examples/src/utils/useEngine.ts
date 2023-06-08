import { Engine } from "lattice-engine/core";
import { buttonGroup, useControls } from "leva";
import { useCallback, useEffect, useState } from "react";
import { World } from "thyseus";

import { ExportSchedule } from "./export";

export const exportConfig: {
  mode: "download" | "test";
  format: "binary" | "json";
} = {
  format: "binary",
  mode: "download",
};

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
    };
  }, [world]);

  const exportScene = useCallback(() => {
    if (!engine) return;
    exportConfig.mode = "download";
    engine.queueSchedule(ExportSchedule);
  }, [engine]);

  const testExport = useCallback(() => {
    if (!engine) return;
    exportConfig.mode = "test";
    exportConfig.format = "binary";
    engine.queueSchedule(ExportSchedule);
  }, [engine]);

  useControls(
    {
      export: buttonGroup({
        glb: () => {
          exportConfig.format = "binary";
          exportScene();
        },
        gltf: () => {
          exportConfig.format = "json";
          exportScene();
        },
        test: testExport,
      }),
    },
    [exportScene]
  );

  return engine;
}
