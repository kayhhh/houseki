import { CoreStore } from "lattice-engine/core";
import { Gltf } from "lattice-engine/gltf";
import { InputStruct } from "lattice-engine/input";
import {
  MeshCollider,
  PhysicsConfig,
  StaticBody,
} from "lattice-engine/physics";
import {
  Geometry,
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

import { createPlayer } from "../../utils/createPlayer";
import { createScene } from "../../utils/createScene";

export function initScene(
  commands: Commands,
  coreStore: Res<Mut<CoreStore>>,
  sceneStruct: Res<Mut<SceneStruct>>,
  inputStruct: Res<Mut<InputStruct>>,
  physicsConfig: Res<Mut<PhysicsConfig>>
) {
  physicsConfig.debug = true;

  const scene = createScene(commands, coreStore, sceneStruct, 4096, 20);

  createPlayer([0, 5, 0], scene, commands, sceneStruct, inputStruct);

  const transform = new Transform(undefined, undefined, [4, 4, 4]);
  const parent = new Parent(scene);
  const gltf = new Gltf("/gltf/Accumula-Town.glb");

  commands
    .spawn()
    .add(transform)
    .addType(GlobalTransform)
    .add(parent)
    .add(gltf);

  dropStruct(transform);
  dropStruct(parent);
  dropStruct(gltf);
}

export function addPhysics(
  meshes: Query<
    Entity,
    [With<[Mesh, Geometry]>, Without<[MeshCollider, StaticBody]>]
  >
) {
  for (const entity of meshes) {
    entity.addType(MeshCollider).addType(StaticBody);
  }
}
