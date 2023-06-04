import { CoreStore } from "lattice-engine/core";
import { OrbitControls } from "lattice-engine/orbit";
import {
  GlobalTransform,
  Parent,
  PerspectiveCamera,
  SceneStruct,
  Transform,
} from "lattice-engine/scene";
import { Text } from "lattice-engine/text";
import { Commands, Mut, Res } from "thyseus";

import { createScene } from "../../utils/createScene";

/**
 * System to initialize the scene.
 */
export function initScene(
  commands: Commands,
  coreStore: Res<Mut<CoreStore>>,
  sceneStruct: Res<Mut<SceneStruct>>
) {
  const scene = createScene(commands, coreStore, sceneStruct);

  const camera = commands
    .spawn()
    .add(new Transform([0, 0, 5]))
    .addType(GlobalTransform)
    .addType(PerspectiveCamera)
    .addType(OrbitControls);
  sceneStruct.activeCamera = camera.id;

  // Create text
  commands
    .spawn()
    .add(new Transform([0, 0, 0]))
    .addType(GlobalTransform)
    .add(new Parent(scene))
    .add(new Text("Hello world!", undefined, 1, [0, 0, 0]));
}
