import { CoreStore, Warehouse } from "lattice-engine/core";
import { OrbitControls } from "lattice-engine/orbit";
import {
  GlobalTransform,
  Mesh,
  Parent,
  PerspectiveCamera,
  SceneStruct,
  Transform,
} from "lattice-engine/scene";
import { Commands, dropStruct, Mut, Res } from "thyseus";

import { createScene } from "../../utils/createScene";
import { createBoxGeometry } from "../../utils/geometry";

export function initScene(
  commands: Commands,
  warehouse: Res<Warehouse>,
  coreStore: Res<Mut<CoreStore>>,
  sceneStruct: Res<Mut<SceneStruct>>
) {
  const scene = createScene(commands, coreStore, sceneStruct);

  // Create camera
  const cameraTransform = new Transform([0, 0, 5]);

  const camera = commands
    .spawn()
    .add(cameraTransform)
    .addType(GlobalTransform)
    .addType(PerspectiveCamera)
    .addType(OrbitControls);

  dropStruct(cameraTransform);

  sceneStruct.activeCamera = camera.id;

  // Create cube
  const geometry = createBoxGeometry(warehouse);
  const parent = new Parent(scene);

  commands
    .spawn()
    .addType(Transform)
    .addType(GlobalTransform)
    .add(parent)
    .addType(Mesh)
    .add(geometry);

  dropStruct(geometry);
  dropStruct(parent);
}
