import { run, WorldBuilder } from "thyseus";

import { createCSM } from "./systems/createCSM";
import { setupMaterials } from "./systems/setupMaterials";
import { updateCSM } from "./systems/updateCSM";

export function csmPlugin(builder: WorldBuilder) {
  builder.addSystems(...run.chain(createCSM, setupMaterials, updateCSM));
}
