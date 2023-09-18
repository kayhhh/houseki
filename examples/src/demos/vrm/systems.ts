import { CoreStore } from "houseki/core";
import { GlobalTransform, Parent, RenderView, Transform } from "houseki/scene";
import { Vrm } from "houseki/vrm";
import { Commands, Mut, Res } from "thyseus";

import { createLights } from "../../utils/createLights";
import { createOrbitControls } from "../../utils/createOrbitControls";
import { createScene } from "../../utils/createScene";

export function initScene(commands: Commands, coreStore: Res<Mut<CoreStore>>) {
  const cameraId = createOrbitControls(commands, [0, 1, -3]);
  const { viewId, sceneId } = createScene(commands, coreStore);

  commands.getById(viewId).add(new RenderView(cameraId));

  createLights(commands, sceneId);

  const transform = new Transform([0, -0.5, 0]);
  const parent = new Parent(sceneId);
  const vrm = new Vrm("/k-robot.vrm");

  commands
    .spawn(true)
    .add(transform)
    .addType(GlobalTransform)
    .add(parent)
    .add(vrm);
}
