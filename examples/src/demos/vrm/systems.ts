import { CoreStore, Warehouse } from "lattice-engine/core";
import {
  GlobalTransform,
  Parent,
  SceneStruct,
  Transform,
} from "lattice-engine/scene";
import { Vrm } from "lattice-engine/vrm";
import { Commands, dropStruct, Mut, Res } from "thyseus";

import { createLights } from "../../utils/createLights";
import { createOrbitControls } from "../../utils/createOrbitControls";
import { createScene } from "../../utils/createScene";

export function initScene(
  commands: Commands,
  warehouse: Res<Mut<Warehouse>>,
  coreStore: Res<Mut<CoreStore>>,
  sceneStruct: Res<Mut<SceneStruct>>
) {
  createOrbitControls(commands, sceneStruct, [0, 1, -3]);
  const { rootId, sceneId } = createScene(
    commands,
    warehouse,
    coreStore,
    sceneStruct
  );
  createLights(commands, sceneId);

  const transform = new Transform([0, -0.5, 0]);
  const parent = new Parent(rootId);
  const vrm = new Vrm();
  vrm.uri.write("/k-robot.vrm", warehouse);

  commands
    .spawn(true)
    .add(transform)
    .addType(GlobalTransform)
    .add(parent)
    .add(vrm);

  dropStruct(transform);
  dropStruct(parent);
  dropStruct(vrm);
}
