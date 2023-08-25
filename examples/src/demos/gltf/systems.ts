import { CoreStore, Warehouse } from "lattice-engine/core";
import { Gltf } from "lattice-engine/gltf";
import { N8AOPass } from "lattice-engine/postprocessing";
import { SceneStruct } from "lattice-engine/scene";
import { Commands, Mut, Query, Res } from "thyseus";

import { createLights } from "../../utils/createLights";
import { createOrbitControls } from "../../utils/createOrbitControls";
import { createScene } from "../../utils/createScene";

export const selectedModel = {
  uri: "",
};

export function initScene(
  commands: Commands,
  warehouse: Res<Mut<Warehouse>>,
  coreStore: Res<Mut<CoreStore>>,
  sceneStruct: Res<Mut<SceneStruct>>
) {
  createOrbitControls(commands, sceneStruct);
  const { rootId, sceneId } = createScene(
    commands,
    warehouse,
    coreStore,
    sceneStruct
  );
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
    gltf.uri.write(selectedModel.uri, warehouse);
  }
}
