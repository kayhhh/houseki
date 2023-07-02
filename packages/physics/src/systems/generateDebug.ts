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
  meshes: Query<[Entity, Mut<Geometry>, Mut<Parent>], With<LineMaterial>>
) {
  if (!physicsConfig.debug) {
    // Remove the debug lines if they exist
    if (debug.linesId) {
      commands.despawnById(debug.linesId);
      debug.linesId = 0n;
    }

    return;
  }

  const buffers = physicsStore.world.debugRender();

  let linesFound = false;

  if (!debug.linesId) {
    linesFound = true;

    const material = new LineMaterial();
    material.vertexColors = true;

    const mesh = new Mesh();
    mesh.mode = MeshMode.LINES;
    mesh.frustumCulled = false;

    const parent = new Parent(sceneStruct.activeScene);

    const linesId = commands
      .spawn(true)
      .add(material)
      .addType(Geometry)
      .add(mesh)
      .addType(Transform)
      .addType(GlobalTransform)
      .add(parent).id;

    debug.linesId = linesId;

    dropStruct(material);
    dropStruct(mesh);
    dropStruct(parent);
  }

  for (const [entity, geometry, parent] of meshes) {
    if (entity.id !== debug.linesId) continue;

    linesFound = true;

    parent.id = sceneStruct.activeScene;

    geometry.positions.write(buffers.vertices, warehouse);
    geometry.colors.write(buffers.colors, warehouse);
  }

  if (!linesFound) {
    // Remove the debug lines if they exist
    if (debug.linesId) {
      commands.despawnById(debug.linesId);
      debug.linesId = 0n;
    }

    return;
  }
}
