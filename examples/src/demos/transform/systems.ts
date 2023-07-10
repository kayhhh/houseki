import { CoreStore, Warehouse } from "lattice-engine/core";
import { OutlinePass } from "lattice-engine/postprocessing";
import {
  GlobalTransform,
  Mesh,
  Parent,
  SceneStruct,
  Transform,
} from "lattice-engine/scene";
import { TransformControls, TransformMode } from "lattice-engine/transform";
import { Commands, dropStruct, Mut, Query, Res } from "thyseus";

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

  const outlinePass = new OutlinePass();
  outlinePass.visibleEdgeColor.set([1, 0, 0]);
  outlinePass.hiddenEdgeColor.set([0, 1, 1]);

  commands.getById(sceneId).add(outlinePass);

  dropStruct(outlinePass);

  const geometry = createBoxGeometry(warehouse);
  const parent = new Parent(rootId);
  const transform = new Transform([2, 0, 0]);

  commands
    .spawn(true)
    .add(transform)
    .addType(GlobalTransform)
    .add(parent)
    .addType(Mesh)
    .add(geometry).id;

  transform.translation.set(0, 0, 0);

  const boxId = commands
    .spawn(true)
    .add(transform)
    .addType(GlobalTransform)
    .add(parent)
    .addType(Mesh)
    .add(geometry).id;

  const transformControls = new TransformControls();
  transformControls.targetId = boxId;

  commands.spawn(true).add(transformControls);

  dropStruct(transform);
  dropStruct(geometry);
  dropStruct(parent);
}

export const transformConfig = {
  mode: TransformMode.Translate,
};

export function setTransformMode(
  transformControls: Query<Mut<TransformControls>>
) {
  for (const controls of transformControls) {
    controls.mode = transformConfig.mode;
  }
}
