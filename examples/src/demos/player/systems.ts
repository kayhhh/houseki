import { CoreStore, CoreStruct, Warehouse } from "@lattice-engine/core";
import { InputStruct } from "@lattice-engine/input";
import {
  Parent,
  PerspectiveCamera,
  Position,
  Rotation,
  Scene,
} from "@lattice-engine/scene";
import { Commands, Mut, Res } from "thyseus";

import { PlayerControls } from "../../../../packages/player/dist";
import { createRoom } from "../../utils/createRoom";

/**
 * System to initialize the scene.
 */
export function initScene(
  commands: Commands,
  warehouse: Res<Warehouse>,
  coreStore: Res<Mut<CoreStore>>,
  coreStruct: Res<Mut<CoreStruct>>,
  inputStruct: Res<Mut<InputStruct>>
) {
  // Set canvas
  const canvas = document.querySelector("canvas");
  if (!canvas) throw new Error("Canvas not found");
  coreStore.canvas = canvas;

  // Create scene
  const scene = commands.spawn().addType(Scene);
  coreStruct.activeScene = scene.id;

  // Create room
  const room = createRoom([15, 2, 15], commands, warehouse);
  room.add(new Parent(scene));

  // Create camera and player
  const camera = commands
    .spawn()
    .add(new Position(0, 4, 0))
    .addType(Rotation)
    .addType(PerspectiveCamera)
    .addType(PlayerControls);
  coreStruct.activeCamera = camera.id;

  inputStruct.enablePointerLock = true;
}
