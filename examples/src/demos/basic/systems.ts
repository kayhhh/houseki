import { CoreStore, Warehouse } from "houseki/core";
import {
  GlobalTransform,
  Mesh,
  Parent,
  RenderView,
  Transform,
} from "houseki/scene";
import { Commands, Mut, Res } from "thyseus";

import { createLights } from "../../utils/createLights";
import { createOrbitControls } from "../../utils/createOrbitControls";
import { createScene } from "../../utils/createScene";
import { createBoxGeometry } from "../../utils/geometry";

export function initScene(
  warehouse: Res<Mut<Warehouse>>,
  commands: Commands,
  coreStore: Res<Mut<CoreStore>>
) {
  const cameraId = createOrbitControls(commands);
  const { viewId, sceneId } = createScene(commands, coreStore);

  commands.getById(viewId).add(new RenderView(cameraId));

  createLights(commands, sceneId);

  commands
    .spawn(true)
    .addType(Transform)
    .addType(GlobalTransform)
    .add(new Parent(sceneId))
    .addType(Mesh)
    .add(createBoxGeometry(warehouse));
}
