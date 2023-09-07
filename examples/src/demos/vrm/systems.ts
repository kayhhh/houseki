import { CoreStore } from "houseki/core";
import { GlobalTransform, Parent, SceneStruct, Transform } from "houseki/scene";
import { Vrm } from "houseki/vrm";
import { Commands, Mut, Res } from "thyseus";

import { createLights } from "../../utils/createLights";
import { createOrbitControls } from "../../utils/createOrbitControls";
import { createScene } from "../../utils/createScene";

export function initScene(
  commands: Commands,
  coreStore: Res<Mut<CoreStore>>,
  sceneStruct: Res<Mut<SceneStruct>>
) {
  createOrbitControls(commands, sceneStruct, [0, 1, -3]);
  const { rootId, sceneId } = createScene(commands, coreStore, sceneStruct);
  createLights(commands, sceneId);

  const transform = new Transform([0, -0.5, 0]);
  const parent = new Parent(rootId);
  const vrm = new Vrm("/k-robot.vrm");

  commands
    .spawn(true)
    .add(transform)
    .addType(GlobalTransform)
    .add(parent)
    .add(vrm);
}
