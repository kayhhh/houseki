import { WorldBuilder } from "thyseus";

import { Resource } from "./warehouse/components";

export function corePlugin(builder: WorldBuilder) {
  builder.registerComponent(Resource);
}
