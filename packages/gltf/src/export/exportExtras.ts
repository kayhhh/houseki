import { Extra } from "../components";
import { ExportContext } from "./context";

export function exportExtras(context: ExportContext, extra: Extra) {
  const node = context.nodes.get(extra.target);
  if (!node) return;

  const extras = node.getExtras();
  const key = extra.key;
  const value = extra.value;

  try {
    extras[key] = JSON.parse(value);
  } catch {
    extras[key] = extra.value;
  }

  node.setExtras(extras);
}
