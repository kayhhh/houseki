import { CoreStore, Warehouse } from "houseki/core";
import { Gltf } from "houseki/gltf";
import { N8AOPass } from "houseki/postprocessing";
import { SceneStruct } from "houseki/scene";
import { Commands, Mut, Query, Res } from "thyseus";

import { createLights } from "../../utils/createLights";
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
  createLights(commands, sceneId);

  commands.getById(sceneId).addType(N8AOPass);

  commands.getById(rootId).addType(Gltf);
}

/**
 * System to update the glTF uri.
 */
export function loadGltf(
  warehouse: Res<Mut<Warehouse>>,
  entities: Query<Mut<Gltf>>
) {
  for (const gltf of entities) {
    gltf.uri = selectedModel.uri;
  }
}
