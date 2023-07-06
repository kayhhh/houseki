import { CoreStore, Warehouse } from "lattice-engine/core";
import {
  GlobalTransform,
  Mesh,
  Parent,
  SceneStruct,
  Transform,
} from "lattice-engine/scene";
import { TransformControls } from "lattice-engine/transform";
import { Commands, dropStruct, Mut, Res } from "thyseus";

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
  const { rootId } = createScene(commands, coreStore, sceneStruct);

  const geometry = createBoxGeometry(warehouse);
  const parent = new Parent(rootId);

  const boxId = commands
    .spawn(true)
    .addType(Transform)
    .addType(GlobalTransform)
    .add(parent)
    .addType(Mesh)
    .add(geometry).id;

  const transformControls = new TransformControls();
  transformControls.targetId = boxId;

  commands.spawn(true).add(transformControls);

  dropStruct(geometry);
  dropStruct(parent);
}
