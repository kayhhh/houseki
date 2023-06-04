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
import { Commands, Mut, Res } from "thyseus";

import { createBoxGeometry } from "../../utils/createBoxGeometry";
import { createScene } from "../../utils/createScene";

/**
 * System to initialize the scene.
 */
export function initScene(
  commands: Commands,
  warehouse: Res<Warehouse>,
  coreStore: Res<Mut<CoreStore>>,
  sceneStruct: Res<Mut<SceneStruct>>
) {
  const scene = createScene(commands, coreStore, sceneStruct);

  // Create camera
  const camera = commands
    .spawn()
    .add(new Transform([0, 0, 5]))
    .addType(GlobalTransform)
    .addType(PerspectiveCamera)
    .addType(OrbitControls);
  sceneStruct.activeCamera = camera.id;

  // Create cube
  const geometry = createBoxGeometry(warehouse);
  commands
    .spawn()
    .addType(Transform)
    .add(new Parent(scene))
    .addType(Mesh)
    .add(geometry);
}
