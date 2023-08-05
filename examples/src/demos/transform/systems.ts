import { CoreStore } from "lattice-engine/core";
import {
  BoxCollider,
  PhysicsConfig,
  StaticBody,
  TargetTransform,
} from "lattice-engine/physics";
import { OutlinePass } from "lattice-engine/postprocessing";
import {
  GlobalTransform,
  Mesh,
  Parent,
  SceneStruct,
  Transform,
} from "lattice-engine/scene";
import { TransformControls, TransformMode } from "lattice-engine/transform";
import { Commands, Mut, Query, Res } from "thyseus";

import { createLights } from "../../utils/createLights";
import { createOrbitControls } from "../../utils/createOrbitControls";
import { createScene } from "../../utils/createScene";
import { createBoxGeometry } from "../../utils/geometry";

export function initScene(
  commands: Commands,
  coreStore: Res<Mut<CoreStore>>,
  sceneStruct: Res<Mut<SceneStruct>>,
  physicsConfig: Res<Mut<PhysicsConfig>>
) {
  physicsConfig.debug = true;

  createOrbitControls(commands, sceneStruct);
  const { rootId, sceneId } = createScene(commands, coreStore, sceneStruct);
  createLights(commands, sceneId);

  const outlinePass = new OutlinePass();
  outlinePass.visibleEdgeColor = [1, 0, 0];
  outlinePass.hiddenEdgeColor = [0, 1, 1];

  commands.getById(sceneId).add(outlinePass);

  const geometry = createBoxGeometry();
  const parent = new Parent(rootId);
  const transform = new Transform([2, 0, 0]);
  const boxCollider = new BoxCollider([1, 1, 1]);

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
    .add(boxCollider)
    .addType(StaticBody)
    .addType(TargetTransform)
    .addType(GlobalTransform)
    .add(parent)
    .addType(Mesh)
    .add(geometry).id;

  const transformControls = new TransformControls();
  transformControls.targetId = boxId;

  commands.spawn(true).add(transformControls);
}

export const transformConfig = {
  enabled: true,
  mode: TransformMode.Translate,
};

export function setTransformMode(
  transformControls: Query<Mut<TransformControls>>
) {
  for (const controls of transformControls) {
    controls.mode = transformConfig.mode;
    controls.enabled = transformConfig.enabled;
  }
}
