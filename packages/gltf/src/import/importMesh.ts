import { Mesh as GltfMesh } from "@gltf-transform/core";
import { Warehouse } from "@lattice-engine/core";
import { Geometry, Mesh } from "@lattice-engine/scene";
import { Commands, dropStruct } from "thyseus";

import { ImportContext } from "./context";
import { importMaterial } from "./importMaterial";

export function importMesh(
  gltfMesh: GltfMesh,
  nodeId: bigint,
  commands: Commands,
  warehouse: Readonly<Warehouse>,
  context: ImportContext
) {
  gltfMesh.listPrimitives().forEach((primitive) => {
    const mesh = new Mesh();
    mesh.parentId = nodeId;

    mesh.mode = primitive.getMode();

    const geometry = new Geometry();

    const positions = primitive.getAttribute("POSITION")?.getArray();
    const normals = primitive.getAttribute("NORMAL")?.getArray();
    const uvs = primitive.getAttribute("TEXCOORD_0")?.getArray();
    const indices = primitive.getIndices()?.getArray();

    if (positions instanceof Float32Array) {
      geometry.positions.write(positions, warehouse);
    } else {
      geometry.positions.write(new Float32Array(), warehouse);
    }

    if (normals instanceof Float32Array) {
      geometry.normals.write(normals, warehouse);
    } else {
      geometry.normals.write(new Float32Array(), warehouse);
    }

    if (uvs instanceof Float32Array) {
      geometry.uvs.write(uvs, warehouse);
    } else {
      geometry.uvs.write(new Float32Array(), warehouse);
    }

    if (indices instanceof Uint16Array || indices instanceof Uint32Array) {
      geometry.indices.write(indices, warehouse);
    } else {
      geometry.indices.write(new Uint32Array(), warehouse);
    }

    const material = primitive.getMaterial();
    if (material) {
      mesh.materialId = importMaterial(material, commands, warehouse, context);
    }

    const meshEntity = commands.spawn().add(mesh).add(geometry);

    dropStruct(mesh);
    dropStruct(geometry);

    context.meshIds.push(meshEntity.id);
  });
}
