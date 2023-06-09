import { CoreStore } from "lattice-engine/core";
import { Gltf } from "lattice-engine/gltf";
import { N8AOPass } from "lattice-engine/n8ao";
import { OrbitControls } from "lattice-engine/orbit";
import {
  GlobalTransform,
  PerspectiveCamera,
  SceneStruct,
  Transform,
} from "lattice-engine/scene";
import { Commands, dropStruct, Mut, Query, Res } from "thyseus";

import { createScene } from "../../utils/createScene";

export const selectedModel = {
  uri: "",
};

export function initScene(
  commands: Commands,
  coreStore: Res<Mut<CoreStore>>,
  sceneStruct: Res<Mut<SceneStruct>>
) {
  const { root } = createScene(commands, coreStore, sceneStruct, 0);

  commands.spawn().addType(N8AOPass);

  // Create camera
  const transform = new Transform([0, 2, 4]);

  const camera = commands
    .spawn()
    .add(transform)
    .addType(GlobalTransform)
    .addType(PerspectiveCamera)
    .addType(OrbitControls);

  dropStruct(transform);

  sceneStruct.activeCamera = camera.id;

  root.addType(Gltf);
}

/**
 * System to update the glTF uri.
 */
export function loadGltf(entities: Query<Mut<Gltf>>) {
  for (const gltf of entities) {
    gltf.uri = selectedModel.uri;
  }
}
