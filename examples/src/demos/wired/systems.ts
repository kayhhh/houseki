import { Asset, CoreStore } from "lattice-engine/core";
import { PhysicsConfig } from "lattice-engine/physics";
import { SceneStruct } from "lattice-engine/scene";
import { WorldJson } from "lattice-engine/wired";
import { Commands, dropStruct, Mut, Res } from "thyseus";

import { createOrbitControls } from "../../utils/createOrbitControls";
import { createScene } from "../../utils/createScene";

export function initScene(
  commands: Commands,
  coreStore: Res<Mut<CoreStore>>,
  sceneStruct: Res<Mut<SceneStruct>>,
  physicsConfig: Res<Mut<PhysicsConfig>>
) {
  physicsConfig.debug = true;

  createOrbitControls(commands, sceneStruct, [0, 4, 8]);
  const { scene } = createScene(commands, coreStore, sceneStruct, 4096, 16);

  const asset = new Asset("/world.json", "application/json");
  scene.add(asset).addType(WorldJson);
  dropStruct(asset);
}
