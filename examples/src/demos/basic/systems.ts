import { CoreStore, Warehouse } from "reddo/core";
import {
  GlobalTransform,
  Mesh,
  Parent,
  SceneStruct,
  Transform,
} from "reddo/scene";
import { Commands, Mut, Res } from "thyseus";

import { createLights } from "../../utils/createLights";
import { createOrbitControls } from "../../utils/createOrbitControls";
import { createScene } from "../../utils/createScene";
import { createBoxGeometry } from "../../utils/geometry";

export function initScene(
  warehouse: Res<Mut<Warehouse>>,
  commands: Commands,
  coreStore: Res<Mut<CoreStore>>,
  sceneStruct: Res<Mut<SceneStruct>>
) {
  createOrbitControls(commands, sceneStruct);
  const { rootId, sceneId } = createScene(commands, coreStore, sceneStruct);
  createLights(commands, sceneId);

  commands
    .spawn(true)
    .addType(Transform)
    .addType(GlobalTransform)
    .add(new Parent(rootId))
    .addType(Mesh)
    .add(createBoxGeometry(warehouse));
}
