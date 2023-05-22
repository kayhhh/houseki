import { CoreStore, CoreStruct } from "@lattice-engine/core";
import { OrbitControls } from "@lattice-engine/orbit";
import {
  Node,
  Parent,
  PerspectiveCamera,
  Position,
  Scene,
} from "@lattice-engine/scene";
import { Vrm } from "@lattice-engine/vrm";
import { Commands, Mut, Res } from "thyseus";

/**
 * System to initialize the scene.
 */
export function initScene(
  commands: Commands,
  coreStore: Res<Mut<CoreStore>>,
  coreStruct: Res<Mut<CoreStruct>>
) {
  // Set canvas
  const canvas = document.querySelector("canvas");
  if (!canvas) throw new Error("Canvas not found");
  coreStore.canvas = canvas;

  // Create scene
  const scene = commands.spawn().addType(Scene);
  coreStruct.activeScene = scene.id;

  // Create camera
  const camera = commands
    .spawn()
    .add(new Position(0, 1, -3))
    .addType(PerspectiveCamera)
    .addType(OrbitControls);
  coreStruct.activeCamera = camera.id;

  // Create avatar
  const vrm = new Vrm();
  vrm.uri = "/k-robot.vrm";
  commands
    .spawn()
    .addType(Node)
    .add(new Position(0, -0.5, 0))
    .add(new Parent(scene))
    .add(vrm);
}
