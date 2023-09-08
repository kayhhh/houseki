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
import { Commands, Entity, Mut, Query, Res, With, Without } from "thyseus";

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
  meshes: Query<[Entity, Mesh], Without<[MeshCollider, Parent]>>,
  nodes: Query<Entity, [With<Transform>, Without<StaticBody>]>
) {
  for (const [entity, mesh] of meshes) {
    // Add mesh collider
    commands
      .getById(entity.id)
      .addType(Transform)
      .addType(GlobalTransform)
      .add(new Parent(mesh.parentId))
      .addType(MeshCollider);

    // Add static body to parent
    for (const nodeEntity of nodes) {
      if (nodeEntity.id !== mesh.parentId) continue;

      commands.getById(entity.id).addType(StaticBody);
    }
  }
}
