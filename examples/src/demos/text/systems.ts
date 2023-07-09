import { CoreStore } from "lattice-engine/core";
import {
  GlobalTransform,
  Parent,
  SceneStruct,
  Transform,
} from "lattice-engine/scene";
import { Text } from "lattice-engine/text";
import { Commands, dropStruct, Mut, Res } from "thyseus";

import { createOrbitControls } from "../../utils/createOrbitControls";
import { createScene } from "../../utils/createScene";

export function initScene(
  commands: Commands,
  coreStore: Res<Mut<CoreStore>>,
  sceneStruct: Res<Mut<SceneStruct>>,
) {
  createOrbitControls(commands, sceneStruct);
  const { rootId } = createScene(commands, coreStore, sceneStruct);

  const transform = new Transform();
  const parent = new Parent(rootId);

  const text = new Text("Hello world!");
  text.color.set([255, 200, 255]);

  commands
    .spawn(true)
    .add(transform.set([0, 0, 0]))
    .addType(GlobalTransform)
    .add(parent)
    .add(text);

  dropStruct(transform);
  dropStruct(parent);
  dropStruct(text);
}
