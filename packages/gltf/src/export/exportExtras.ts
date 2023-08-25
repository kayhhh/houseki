import { Warehouse } from "@lattice-engine/core";

import { Extra } from "../components";
import { ExportContext } from "./context";

export function exportExtras(
  context: ExportContext,
  warehouse: Warehouse,
  extra: Extra
) {
  const node = context.nodes.get(extra.target);
  if (!node) return;

  const extras = node.getExtras();
  const key = extra.key.read(warehouse) ?? "";
  const value = extra.value.read(warehouse) ?? "";

  try {
    extras[key] = JSON.parse(value);
  } catch {
    extras[key] = extra.value;
  }

  node.setExtras(extras);
}
