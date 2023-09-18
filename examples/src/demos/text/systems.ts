import { CoreStore } from "houseki/core";
import { GlobalTransform, Parent, RenderView, Transform } from "houseki/scene";
import { Text } from "houseki/text";
import { Commands, Mut, Res } from "thyseus";

import { createLights } from "../../utils/createLights";
import { createOrbitControls } from "../../utils/createOrbitControls";
import { createScene } from "../../utils/createScene";

export function initScene(commands: Commands, coreStore: Res<Mut<CoreStore>>) {
  const cameraId = createOrbitControls(commands);
  const { viewId, sceneId } = createScene(commands, coreStore);

  commands.getById(viewId).add(new RenderView(cameraId));

  createLights(commands, sceneId);

  const transform = new Transform();
  const parent = new Parent(sceneId);

  const text = new Text("Hello world!");
  text.color = [255, 200, 255];

  commands
    .spawn(true)
    .add(transform.set([0, 0, 0]))
    .addType(GlobalTransform)
    .add(parent)
    .add(text);
}
