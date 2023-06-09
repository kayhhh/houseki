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
import { Commands, dropStruct, Mut, Res } from "thyseus";

import { createScene } from "../../utils/createScene";

export function initScene(
  commands: Commands,
  coreStore: Res<Mut<CoreStore>>,
  sceneStruct: Res<Mut<SceneStruct>>
) {
  const { root } = createScene(commands, coreStore, sceneStruct);

  const transform = new Transform([0, 0, 5]);

  const camera = commands
    .spawn()
    .add(transform)
    .addType(GlobalTransform)
    .addType(PerspectiveCamera)
    .addType(OrbitControls);

  sceneStruct.activeCamera = camera.id;

  const parent = new Parent(root);
  const text = new Text("Hello world!", undefined, 1, [0, 0, 0]);

  commands
    .spawn()
    .add(transform.set([0, 0, 0]))
    .addType(GlobalTransform)
    .add(parent)
    .add(text);

  dropStruct(transform);
  dropStruct(parent);
  dropStruct(text);
}
