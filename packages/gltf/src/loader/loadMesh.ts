import { Mesh as GltfMesh } from "@gltf-transform/core";
import { Warehouse } from "@lattice-engine/core";
import {
  Geometry,
  GlobalTransform,
  Mesh,
  Parent,
  Transform,
} from "@lattice-engine/scene";
import { Commands, dropStruct, EntityCommands } from "thyseus";

import { LoadingContext } from "./context";
import { loadMaterial } from "./loadMaterial";

export function loadMesh(
  gltfMesh: GltfMesh,
  entity: EntityCommands,
  commands: Commands,
  warehouse: Readonly<Warehouse>,
  context: LoadingContext
) {
  gltfMesh.listPrimitives().forEach((primitive) => {
    const parent = new Parent();
    parent.id = entity.id;

    const mesh = new Mesh();
    const geometry = new Geometry();

    const positions = primitive.getAttribute("POSITION")?.getArray();
    const normals = primitive.getAttribute("NORMAL")?.getArray();
    const uvs = primitive.getAttribute("TEXCOORD_0")?.getArray();
    const indices = primitive.getIndices()?.getArray();

    if (positions instanceof Float32Array) {
      geometry.positions.write(positions, warehouse);
    }

    if (normals instanceof Float32Array) {
      geometry.normals.write(normals, warehouse);
    }

    if (uvs instanceof Float32Array) {
      geometry.uvs.write(uvs, warehouse);
    }

    if (indices instanceof Uint16Array || indices instanceof Uint32Array) {
      geometry.indices.write(indices, warehouse);
    }

    const material = primitive.getMaterial();
    if (material) {
      const materialEntity = loadMaterial(
        material,
        commands,
        warehouse,
        context
      );
      mesh.materialId = materialEntity.id;
    }

    const meshEnity = commands
      .spawn()
      .addType(Transform)
      .addType(GlobalTransform)
      .add(parent)
      .add(mesh)
      .add(geometry);

    dropStruct(parent);
    dropStruct(mesh);
    dropStruct(geometry);

    context.meshes.push(meshEnity.id);
  });
}
