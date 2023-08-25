import { CoreStore, Warehouse } from "lattice-engine/core";
import { Gltf } from "lattice-engine/gltf";
import {
  MeshCollider,
  PhysicsConfig,
  StaticBody,
} from "lattice-engine/physics";
import {
  GlobalTransform,
  Mesh,
  Parent,
  SceneStruct,
  Transform,
} from "lattice-engine/scene";
import {
  Commands,
  dropStruct,
  Entity,
  Mut,
  Query,
  Res,
  With,
  Without,
} from "thyseus";

import { createLights } from "../../utils/createLights";
import { createPlayer } from "../../utils/createPlayer";
import { createScene } from "../../utils/createScene";

export function initScene(
  commands: Commands,
  warehouse: Res<Mut<Warehouse>>,
  coreStore: Res<Mut<CoreStore>>,
  sceneStruct: Res<Mut<SceneStruct>>,
  physicsConfig: Res<Mut<PhysicsConfig>>
) {
  physicsConfig.debug = true;

  const { sceneId, rootId } = createScene(
    commands,
    warehouse,
    coreStore,
    sceneStruct
  );
  createLights(commands, sceneId, 4096, 20);

  createPlayer([0, 5, 0], sceneId, commands, warehouse, sceneStruct);

  const transform = new Transform(undefined, undefined, [4, 4, 4]);
  const parent = new Parent(rootId);
  const gltf = new Gltf();
  gltf.uri.write("/gltf/Accumula-Town.glb", warehouse);

  commands
    .spawn(true)
    .add(transform)
    .addType(GlobalTransform)
    .add(parent)
    .add(gltf);

  dropStruct(transform);
  dropStruct(parent);
  dropStruct(gltf);
}

export function addPhysics(
  commands: Commands,
  meshes: Query<[Entity, Mesh], Without<[MeshCollider, Parent]>>,
  nodes: Query<Entity, [With<Transform>, Without<StaticBody>]>
) {
  for (const [entity, mesh] of meshes) {
    // Add mesh collider
    const parent = new Parent(mesh.parentId);
    commands
      .getById(entity.id)
      .addType(Transform)
      .addType(GlobalTransform)
      .add(parent)
      .addType(MeshCollider);
    dropStruct(parent);

    // Add static body to parent
    for (const nodeEntity of nodes) {
      if (nodeEntity.id !== mesh.parentId) continue;

      commands.getById(entity.id).addType(StaticBody);
    }
  }
}
