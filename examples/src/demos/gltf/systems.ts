import { CoreStore } from "lattice-engine/core";
import { Gltf } from "lattice-engine/gltf";
import { N8AOPass } from "lattice-engine/n8ao";
import { OrbitControls } from "lattice-engine/orbit";
import {
  GlobalTransform,
  Parent,
  PerspectiveCamera,
  SceneStruct,
  Transform,
} from "lattice-engine/scene";
import { Commands, Mut, Query, Res } from "thyseus";

import { createScene } from "../../utils/createScene";

// Using a local variable like this will not work with multi-threading
// TODO: Find a better solution
export const selectedModel = {
  uri: "",
};

/**
 * System to initialize the scene.
 */
export function initScene(
  commands: Commands,
  coreStore: Res<Mut<CoreStore>>,
  sceneStruct: Res<Mut<SceneStruct>>
) {
  const scene = createScene(commands, coreStore, sceneStruct, 0);

  commands.spawn().add(new N8AOPass());

  // Create camera
  const camera = commands
    .spawn()
    .add(new Transform([0, 2, 4]))
    .addType(GlobalTransform)
    .addType(PerspectiveCamera)
    .addType(OrbitControls);
  sceneStruct.activeCamera = camera.id;

  // Add node to scene with glTF component
  commands
    .spawn()
    .addType(Transform)
    .addType(GlobalTransform)
    .add(new Parent(scene))
    .addType(Gltf);
}

/**
 * System to update the glTF uri.
 */
export function loadGltf(entities: Query<Mut<Gltf>>) {
  for (const gltf of entities) {
    gltf.uri = selectedModel.uri;
  }
}
