import { CoreStore, Warehouse } from "lattice-engine/core";
import {
  GlobalTransform,
  Mesh,
  Parent,
  SceneStruct,
  Transform,
} from "lattice-engine/scene";
import { Commands, dropStruct, Mut, Res } from "thyseus";

import { createLights } from "../../utils/createLights";
import { createOrbitControls } from "../../utils/createOrbitControls";
import { createScene } from "../../utils/createScene";
import { createBoxGeometry } from "../../utils/geometry";

export function initScene(
  commands: Commands,
  warehouse: Res<Warehouse>,
  coreStore: Res<Mut<CoreStore>>,
  sceneStruct: Res<Mut<SceneStruct>>
) {
  createOrbitControls(commands, sceneStruct);
  const { rootId, sceneId } = createScene(commands, coreStore, sceneStruct);
  createLights(commands, sceneId);

  const geometry = createBoxGeometry(warehouse);
  const parent = new Parent(rootId);

  commands
    .spawn(true)
    .addType(Transform)
    .addType(GlobalTransform)
    .add(parent)
    .addType(Mesh)
    .add(geometry);

  dropStruct(geometry);
  dropStruct(parent);
}
