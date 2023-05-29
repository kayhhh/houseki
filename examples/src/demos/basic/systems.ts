import { CoreStore, Warehouse } from "lattice-engine/core";
import { OrbitControls } from "lattice-engine/orbit";
import {
  Mesh,
  Node,
  Parent,
  PerspectiveCamera,
  Position,
  Scene,
  SceneStruct,
} from "lattice-engine/scene";
import { Commands, Mut, Res } from "thyseus";

import { createBoxGeometry } from "../../utils/createBoxGeometry";

/**
 * System to initialize the scene.
 */
export function initScene(
  commands: Commands,
  warehouse: Res<Warehouse>,
  coreStore: Res<Mut<CoreStore>>,
  sceneStruct: Res<Mut<SceneStruct>>
) {
  // Set canvas
  const canvas = document.querySelector("canvas");
  if (!canvas) throw new Error("Canvas not found");
  coreStore.canvas = canvas;

  // Create scene
  const scene = commands.spawn().addType(Scene);
  sceneStruct.activeScene = scene.id;

  // Create camera
  const camera = commands
    .spawn()
    .add(new Position(0, 0, 5))
    .addType(PerspectiveCamera)
    .addType(OrbitControls);
  sceneStruct.activeCamera = camera.id;

  // Create cube
  const geometry = createBoxGeometry(warehouse);
  commands
    .spawn()
    .addType(Node)
    .add(new Parent(scene))
    .addType(Mesh)
    .add(geometry);
}
