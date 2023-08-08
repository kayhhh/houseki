import { Mesh as GltfMesh, Primitive } from "@gltf-transform/core";
import { Warehouse } from "@lattice-engine/core";
import { Geometry, Mesh } from "@lattice-engine/scene";
import { Commands, dropStruct } from "thyseus";

import { ImportContext } from "./context";
import { importMaterial } from "./importMaterial";

const THREE_TO_ECS_ATTRIBUTES = {
  COLOR_0: "colors",
  JOINTS_0: "joints",
  NORMAL: "normals",
  POSITION: "positions",
  TEXCOORD_0: "uv",
  TEXCOORD_1: "uv1",
  TEXCOORD_2: "uv2",
  TEXCOORD_3: "uv3",
  WEIGHTS_0: "weights",
} as const;

export function importMesh(
  gltfMesh: GltfMesh,
  nodeId: bigint,
  commands: Commands,
  warehouse: Readonly<Warehouse>,
  context: ImportContext,
) {
  gltfMesh.listPrimitives().forEach((primitive) => {
    const mesh = new Mesh();
    mesh.parentId = nodeId;

    mesh.mode = primitive.getMode();

    const geometry = new Geometry();

    setAttribute("POSITION", primitive, geometry, warehouse);
    setAttribute("NORMAL", primitive, geometry, warehouse);
    setAttribute("TEXCOORD_0", primitive, geometry, warehouse);
    setAttribute("TEXCOORD_1", primitive, geometry, warehouse);
    setAttribute("TEXCOORD_2", primitive, geometry, warehouse);
    setAttribute("TEXCOORD_3", primitive, geometry, warehouse);
    setAttribute("COLOR_0", primitive, geometry, warehouse);
    setAttribute("JOINTS_0", primitive, geometry, warehouse);
    setAttribute("WEIGHTS_0", primitive, geometry, warehouse);

    const indices = primitive.getIndices()?.getArray();

    if (indices instanceof Uint16Array) {
      const indices32 = new Uint32Array(indices.length);

      for (let i = 0; i < indices.length; i++) {
        indices32[i] = indices[i] ?? 0;
      }

      geometry.indices.write(indices32, warehouse);
    } else if (indices instanceof Uint32Array) {
      geometry.indices.write(indices, warehouse);
    } else {
      geometry.indices.write(new Uint32Array(), warehouse);
    }

    const material = primitive.getMaterial();
    if (material) {
      mesh.materialId = importMaterial(material, commands, warehouse, context);
    }

    context.name.value = gltfMesh.getName() || `Mesh_${context.meshIds.length}`;

    const meshId = commands
      .spawn(true)
      .add(mesh)
      .add(geometry)
      .add(context.name).id;

    dropStruct(mesh);
    dropStruct(geometry);

    context.meshIds.push(meshId);
  });

  context.meshes.set(gltfMesh, nodeId);
}

function setAttribute(
  name: keyof typeof THREE_TO_ECS_ATTRIBUTES,
  primitive: Primitive,
  geometry: Geometry,
  warehouse: Readonly<Warehouse>,
) {
  const array = primitive.getAttribute(name)?.getArray();
  const ecsName = THREE_TO_ECS_ATTRIBUTES[name];

  if (array instanceof Float32Array) {
    geometry[ecsName].write(array, warehouse);
  } else {
    geometry[ecsName].write(new Float32Array(), warehouse);
  }
}
