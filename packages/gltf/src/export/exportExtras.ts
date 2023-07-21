import { Extra } from "../components";
import { ExportContext } from "./context";

export function exportExtras(context: ExportContext, extra: Extra) {
  const node = context.nodes.get(extra.target);
  if (!node) return;

  const extras = node.getExtras();

  try {
    extras[extra.key] = JSON.parse(extra.value);
  } catch {
    extras[extra.key] = extra.value;
  }

  node.setExtras(extras);
}
