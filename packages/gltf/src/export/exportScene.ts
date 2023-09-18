import { ExportContext } from "./context";

export function exportScene(context: ExportContext, entityId: bigint) {
  const isDefaultScene = context.defaultSceneId === entityId;
  const gltfScene = isDefaultScene
    ? context.defaultScene
    : context.doc.createScene();

  context.scenes.set(entityId, gltfScene);

  for (const [id, node] of context.nodes) {
    const parentId = context.parents.get(id);
    if (parentId !== entityId) continue;

    gltfScene.addChild(node);
  }
}
