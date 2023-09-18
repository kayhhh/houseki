import { Warehouse } from "@houseki-engine/core";
import {
  Geometry,
  GlobalTransform,
  LineMaterial,
  Mesh,
  MeshMode,
  Parent,
  RenderView,
  SceneView,
  Transform,
} from "@houseki-engine/scene";
import { Commands, Entity, Mut, Query, Res, With } from "thyseus";

import { DebugResource, PhysicsConfig, PhysicsStore } from "../resources";

export function generateDebug(
  warehouse: Res<Mut<Warehouse>>,
  commands: Commands,
  debug: Res<Mut<DebugResource>>,
  physicsStore: Res<PhysicsStore>,
  physicsConfig: Res<PhysicsConfig>,
  views: Query<SceneView, With<RenderView>>,
  meshes: Query<[Entity, Mut<Geometry>, Mut<Parent>], With<LineMaterial>>
) {
  if (!physicsConfig.debug) {
    // Remove the debug lines if they exist
    if (debug.linesId) {
      commands.despawnById(debug.linesId);
      debug.linesId = 0n;
    }

    // @ts-expect-error
    debug.serialize();

    return;
  }

  const buffers = physicsStore.world.debugRender();

  let sceneId = 0n;

  for (const view of views) {
    sceneId = view.active;
  }

  let linesFound = false;

  if (!debug.linesId) {
    linesFound = true;

    const material = new LineMaterial();
    material.vertexColors = true;

    const mesh = new Mesh();
    mesh.mode = MeshMode.LINES;
    mesh.frustumCulled = false;

    const parent = new Parent(sceneId);

    const linesId = commands
      .spawn(true)
      .add(material)
      .addType(Geometry)
      .add(mesh)
      .addType(Transform)
      .addType(GlobalTransform)
      .add(parent).id;

    debug.linesId = linesId;
  }

  for (const [entity, geometry, parent] of meshes) {
    if (entity.id !== debug.linesId) continue;

    linesFound = true;

    parent.id = sceneId;

    geometry.positions.write(buffers.vertices, warehouse);
    geometry.colors.write(buffers.colors, warehouse);
  }

  if (!linesFound && debug.linesId) {
    commands.despawnById(debug.linesId);
    debug.linesId = 0n;
  }
}
