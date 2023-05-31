import { run, WorldBuilder } from "thyseus";

import { mainLoopDelta } from "./systems/mainLoopDelta";
import { Resource } from "./warehouse/components";

export function corePlugin(builder: WorldBuilder) {
  builder.registerComponent(Resource).addSystems(run(mainLoopDelta).first());
}
