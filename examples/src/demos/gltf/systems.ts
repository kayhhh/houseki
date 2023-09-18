import { CoreStore } from "houseki/core";
import { Gltf } from "houseki/gltf";
import { N8AOPass } from "houseki/postprocessing";
import { RenderView } from "houseki/scene";
import { Commands, Mut, Query, Res } from "thyseus";

import { createOrbitControls } from "../../utils/createOrbitControls";
import { createScene } from "../../utils/createScene";

export const selectedModel = {
  uri: "",
};

export function initScene(commands: Commands, coreStore: Res<Mut<CoreStore>>) {
  const cameraId = createOrbitControls(commands);
  const { viewId, sceneId } = createScene(commands, coreStore);

  commands.getById(viewId).add(new RenderView(cameraId)).addType(N8AOPass);
  commands.getById(sceneId).addType(Gltf);
}

/**
 * System to update the glTF uri.
 */
export function loadGltf(gltfs: Query<Mut<Gltf>>) {
  for (const gltf of gltfs) {
    gltf.uri = selectedModel.uri;
  }
}
