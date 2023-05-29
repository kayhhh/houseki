import { CoreStore } from "lattice-engine/core";
import { Gltf } from "lattice-engine/gltf";
import { OrbitControls } from "lattice-engine/orbit";
import {
  Node,
  Parent,
  PerspectiveCamera,
  Position,
  Scene,
  SceneStruct,
} from "lattice-engine/scene";
import { Commands, Mut, Query, Res } from "thyseus";

// Using a local variable like this will not work with multi-threading
// TODO: Find a better solution
export const selectedModel = {
  uri: "",
};

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
    .add(new Position(0, 2, 4))
    .addType(PerspectiveCamera)
    .addType(OrbitControls);
  sceneStruct.activeCamera = camera.id;

  // Add node to scene with glTF component
  commands.spawn().addType(Node).add(new Parent(scene)).addType(Gltf);
}

/**
 * System to update the glTF uri.
 */
export function loadGltf(entities: Query<Mut<Gltf>>) {
  for (const gltf of entities) {
    gltf.uri = selectedModel.uri;
  }
}
