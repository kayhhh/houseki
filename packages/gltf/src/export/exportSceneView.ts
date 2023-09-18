import { SceneView } from "@houseki-engine/scene";

import { ExportContext } from "./context";

export function exportSceneView(context: ExportContext, sceneView: SceneView) {
  context.defaultSceneId = sceneView.active || sceneView.scenes[0] || 0n;
}
