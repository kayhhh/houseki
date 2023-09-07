import { gltfPlugin } from "reddo/gltf";
import { defaultPlugin } from "reddo/utils";
import { WorldBuilder } from "thyseus";

import { exportLoadingInfo } from "../components/loading/system";
import { statsSystem } from "../components/stats/system";
import { ExportSchedule, handleExport, sendExportEvent } from "./export";
import { handlePointerLockToggle } from "./usePointerLockToggle";

export function demoPlugin(builder: WorldBuilder) {
  builder
    .addPlugin(defaultPlugin)
    .addPlugin(gltfPlugin)
    .addSystems(
      statsSystem,
      exportLoadingInfo,
      handleExport,
      handlePointerLockToggle
    )
    .addSystemsToSchedule(ExportSchedule, sendExportEvent);
}
