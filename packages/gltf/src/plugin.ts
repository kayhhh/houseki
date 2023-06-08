import { run, WorldBuilder } from "thyseus";

import { GltfSchedules } from "./schedules";
import { exportGlb } from "./systems/exportGltf";
import { importGltf } from "./systems/importGltf";
import { sendExportEvent } from "./systems/sendExportEvent";

export function gltfPlugin(builder: WorldBuilder) {
  builder.addSystems(importGltf, run(exportGlb).first());
  builder.addSystemsToSchedule(GltfSchedules.Export, sendExportEvent);
}
