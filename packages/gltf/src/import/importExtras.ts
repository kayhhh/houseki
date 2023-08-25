import { Node } from "@gltf-transform/core";
import { Warehouse } from "@lattice-engine/core";
import { Commands, dropStruct } from "thyseus";

import { Extra } from "../components";

export function importExtras(
  commands: Commands,
  warehouse: Warehouse,
  node: Node,
  entityId: bigint
) {
  const extras = Object.entries(node.getExtras());
  if (extras.length === 0) return;

  const extra = new Extra();
  extra.target = entityId;

  for (const [key, value] of extras) {
    extra.key.write(key, warehouse);
    extra.value.write(JSON.stringify(value), warehouse);

    commands.spawn(true).add(extra);
  }

  dropStruct(extra);
}
