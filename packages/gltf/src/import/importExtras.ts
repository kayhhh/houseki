import { Node } from "@gltf-transform/core";
import { Commands } from "thyseus";

import { Extra } from "../components";

export function importExtras(commands: Commands, node: Node, entityId: bigint) {
  const extras = Object.entries(node.getExtras());
  if (extras.length === 0) return;

  const extra = new Extra();
  extra.target = entityId;

  for (const [key, value] of extras) {
    extra.key = key;
    extra.value = JSON.stringify(value);

    commands.spawn(true).add(extra);
  }
}
