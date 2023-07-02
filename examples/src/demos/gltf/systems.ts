import { CoreStore } from "lattice-engine/core";
import { Gltf } from "lattice-engine/gltf";
import { N8AOPass } from "lattice-engine/n8ao";
import { SceneStruct } from "lattice-engine/scene";
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
  const { rootId } = createScene(commands, coreStore, sceneStruct, 0);

  commands.spawn(true).addType(N8AOPass);

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
