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
import {
  Commands,
  dropStruct,
  Entity,
  Query,
  Res,
  struct,
  SystemRes,
  With,
} from "thyseus";

import { PhysicsConfig, PhysicsStore } from "../resources";

@struct
class LocalStore {
  /**
   * The entity id of the debug lines.
   */
  @struct.u64 declare linesId: bigint;
}

export function generateDebug(
  commands: Commands,
  warehouse: Res<Warehouse>,
  localStore: SystemRes<LocalStore>,
  physicsStore: Res<PhysicsStore>,
  physicsConfig: Res<PhysicsConfig>,
  sceneStruct: Res<SceneStruct>,
  meshes: Query<[Entity, Geometry], With<Mesh>>
) {
  if (!physicsConfig.debug) {
    // Remove the debug lines if they exist
    if (localStore.linesId) {
      commands.despawn(localStore.linesId);
      localStore.linesId = 0n;
    }

    return;
  }

  const buffers = physicsStore.world.debugRender();

  if (!localStore.linesId) {
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

    localStore.linesId = lines.id;

    dropStruct(material);
    dropStruct(parent);
    dropStruct(mesh);
  }

  for (const [entity, geometry] of meshes) {
    if (entity.id !== localStore.linesId) continue;

    geometry.positions.write(buffers.vertices, warehouse);
    geometry.colors.write(buffers.colors, warehouse);
  }
}
