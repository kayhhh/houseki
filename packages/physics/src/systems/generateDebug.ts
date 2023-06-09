import { Warehouse } from "@lattice-engine/core";
import {
  Geometry,
  GlobalTransform,
  LineMaterial,
  Mesh,
  MeshMode,
  Parent,
  SceneStruct,
  Transform,
} from "@lattice-engine/scene";
import { Commands, dropStruct, Entity, Mut, Query, Res, With } from "thyseus";

import { DebugResource, PhysicsConfig, PhysicsStore } from "../resources";

export function generateDebug(
  commands: Commands,
  warehouse: Res<Warehouse>,
  debug: Res<Mut<DebugResource>>,
  physicsStore: Res<PhysicsStore>,
  physicsConfig: Res<PhysicsConfig>,
  sceneStruct: Res<SceneStruct>,
  meshes: Query<[Entity, Geometry], With<Mesh>>
) {
  if (!physicsConfig.debug) {
    // Remove the debug lines if they exist
    if (debug.linesId) {
      commands.despawn(debug.linesId);
      debug.linesId = 0n;
    }

    return;
  }

  const buffers = physicsStore.world.debugRender();

  if (!debug.linesId) {
    const material = new LineMaterial();
    material.vertexColors = true;

    const parent = new Parent();
    parent.id = sceneStruct.activeScene;

    const mesh = new Mesh();
    mesh.mode = MeshMode.LINES;
    mesh.frustumCulled = false;

    const lines = commands
      .spawn()
      .add(material)
      .addType(Geometry)
      .add(mesh)
      .addType(Transform)
      .addType(GlobalTransform)
      .add(parent);

    debug.linesId = lines.id;

    dropStruct(material);
    dropStruct(parent);
    dropStruct(mesh);
  }

  for (const [entity, geometry] of meshes) {
    if (entity.id !== debug.linesId) continue;

    geometry.positions.write(buffers.vertices, warehouse);
    geometry.colors.write(buffers.colors, warehouse);
  }
}
