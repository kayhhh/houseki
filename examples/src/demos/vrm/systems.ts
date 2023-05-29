import { CoreStore } from "@lattice-engine/core";
import { OrbitControls } from "@lattice-engine/orbit";
import {
  Node,
  Parent,
  PerspectiveCamera,
  Position,
  Scene,
  SceneStruct,
} from "@lattice-engine/scene";
import { Vrm } from "@lattice-engine/vrm";
import { Commands, Mut, Res } from "thyseus";

/**
 * System to initialize the scene.
 */
export function initScene(
  commands: Commands,
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
    .add(new Position(0, 1, -3))
    .addType(PerspectiveCamera)
    .addType(OrbitControls);
  sceneStruct.activeCamera = camera.id;

  // Create VRM
  commands
    .spawn()
    .addType(Node)
    .add(new Position(0, -0.5, 0))
    .add(new Parent(scene))
    .add(new Vrm("/k-robot.vrm"));
}
