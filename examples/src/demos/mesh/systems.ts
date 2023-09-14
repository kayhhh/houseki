import { CoreStore } from "houseki/core";
import { Gltf } from "houseki/gltf";
import { MeshCollider, PhysicsConfig, StaticBody } from "houseki/physics";
import {
  GlobalTransform,
  Mesh,
  Parent,
  SceneStruct,
  Transform,
} from "houseki/scene";
import { Commands, Mut, Query, Res, Without } from "thyseus";

import { createLights } from "../../utils/createLights";
import { createPlayer } from "../../utils/createPlayer";
import { createScene } from "../../utils/createScene";

export function initScene(
  commands: Commands,
  coreStore: Res<Mut<CoreStore>>,
  sceneStruct: Res<Mut<SceneStruct>>,
  physicsConfig: Res<Mut<PhysicsConfig>>
) {
  physicsConfig.debug = true;

  const { sceneId, rootId } = createScene(commands, coreStore, sceneStruct);

  createLights(commands, sceneId, 4096, 20);
  createPlayer([0, 5, 0], sceneId, commands, sceneStruct);

  commands
    .spawn(true)
    .add(new Transform(undefined, undefined, [4, 4, 4]))
    .addType(GlobalTransform)
    .add(new Parent(rootId))
    .add(new Gltf("/models/Accumula-Town.glb"));
}

export function addPhysics(
  commands: Commands,
  meshes: Query<Mesh, Without<[MeshCollider, Parent]>>
) {
  const processed: bigint[] = [];

  for (const mesh of meshes) {
    if (processed.includes(mesh.parentId)) continue;
    processed.push(mesh.parentId);

    commands.getById(mesh.parentId).addType(MeshCollider).addType(StaticBody);
  }
}
