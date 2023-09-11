import { CoreStore } from "houseki/core";
import { Gltf } from "houseki/gltf";
import { N8AOPass } from "houseki/postprocessing";
import { SceneStruct } from "houseki/scene";
import { Commands, Mut, Query, Res } from "thyseus";

import { createOrbitControls } from "../../utils/createOrbitControls";
import { createScene } from "../../utils/createScene";

export const selectedModel = {
  uri: "",
};

export function initScene(
  commands: Commands,
  coreStore: Res<Mut<CoreStore>>,
  sceneStruct: Res<Mut<SceneStruct>>
) {
  createOrbitControls(commands, sceneStruct);
  const { rootId, sceneId } = createScene(commands, coreStore, sceneStruct);

  commands.getById(sceneId).addType(N8AOPass);
  commands.getById(rootId).addType(Gltf);
}

/**
 * System to update the glTF uri.
 */
export function loadGltf(entities: Query<Mut<Gltf>>) {
  for (const gltf of entities) {
    gltf.uri = selectedModel.uri;
  }
}
