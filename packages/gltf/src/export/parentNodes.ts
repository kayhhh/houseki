import { ExportContext } from "./context";

export function parentNodes(context: ExportContext) {
  for (const [id, node] of context.nodes) {
    const parentId = context.parents.get(id);
    if (parentId === undefined) continue;

    const parentNode = context.nodes.get(parentId);
    if (parentNode === undefined) continue;

    parentNode.addChild(node);
  }
}
