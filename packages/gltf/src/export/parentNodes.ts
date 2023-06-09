import { ExportContext } from "./context";

export function parentNodes(context: ExportContext, rootId: bigint) {
  for (const [id, node] of context.nodes) {
    const parentId = context.parents.get(id);
    if (parentId === undefined) continue;

    if (parentId === rootId) {
      context.scene.addChild(node);
    } else {
      const parentNode = context.nodes.get(parentId);
      if (parentNode === undefined) continue;

      parentNode.addChild(node);
    }
  }
}
