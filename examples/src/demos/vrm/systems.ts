import { CoreStore } from "lattice-engine/core";
import { OrbitControls } from "lattice-engine/orbit";
import {
  GlobalTransform,
  Parent,
  PerspectiveCamera,
  SceneStruct,
  Transform,
} from "lattice-engine/scene";
import { Vrm } from "lattice-engine/vrm";
import { Commands, dropStruct, Mut, Res } from "thyseus";

import { createScene } from "../../utils/createScene";

export function initScene(
  commands: Commands,
  coreStore: Res<Mut<CoreStore>>,
  sceneStruct: Res<Mut<SceneStruct>>
) {
  const scene = createScene(commands, coreStore, sceneStruct);

  const transform = new Transform([0, 1, -3]);

  const camera = commands
    .spawn()
    .add(transform)
    .addType(GlobalTransform)
    .addType(PerspectiveCamera)
    .addType(OrbitControls);

  sceneStruct.activeCamera = camera.id;

  const parent = new Parent(scene);
  const vrm = new Vrm("/k-robot.vrm");

  commands
    .spawn()
    .add(transform.set([0, -0.5, 0]))
    .addType(GlobalTransform)
    .add(parent)
    .add(vrm);

  dropStruct(transform);
  dropStruct(parent);
  dropStruct(vrm);
}
