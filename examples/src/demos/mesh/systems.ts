import { CoreStore } from "houseki/core";
import { Gltf } from "houseki/gltf";
import { MeshCollider, PhysicsConfig, StaticBody } from "houseki/physics";
import {
  GlobalTransform,
  Mesh,
  Parent,
  RenderView,
  Transform,
} from "houseki/scene";
import { Commands, Entity, Mut, Query, Res, Without } from "thyseus";

import { createLights } from "../../utils/createLights";
import { createPlayer } from "../../utils/createPlayer";
import { createScene } from "../../utils/createScene";

export function initScene(
  commands: Commands,
  coreStore: Res<Mut<CoreStore>>,
  physicsConfig: Res<Mut<PhysicsConfig>>
) {
  physicsConfig.debug = true;

  const { viewId, sceneId } = createScene(commands, coreStore);
  const cameraId = createPlayer([0, 5, 0], sceneId, commands);

  commands.getById(viewId).add(new RenderView(cameraId));

  createLights(commands, sceneId, 4096, 20);

  const transform = new Transform();
  transform.scale.set(4, 4, 4);

  commands
    .spawn(true)
    .add(transform)
    .addType(GlobalTransform)
    .add(new Parent(sceneId))
    .add(new Gltf("/models/Accumula-Town.glb"));
}

export function addPhysics(
  commands: Commands,
  meshes: Query<Mesh>,
  withoutCollider: Query<Entity, Without<MeshCollider, StaticBody>>
) {
  const processed: bigint[] = [];

  for (const mesh of meshes) {
    if (processed.includes(mesh.parentId)) continue;
    processed.push(mesh.parentId);

    for (const entity of withoutCollider) {
      if (entity.id !== mesh.parentId) continue;
      commands.get(entity).addType(MeshCollider).addType(StaticBody);
    }
  }
}
