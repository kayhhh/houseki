import { Mesh as GltfMesh, Primitive } from "@gltf-transform/core";
import { Warehouse } from "@houseki-engine/core";
import { Geometry, Mesh } from "@houseki-engine/scene";
import { Commands } from "thyseus";

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
  warehouse: Warehouse,
  gltfMesh: GltfMesh,
  nodeId: bigint,
  commands: Commands,
  context: ImportContext
) {
  gltfMesh.listPrimitives().forEach((primitive) => {
    const mesh = new Mesh();
    mesh.parentId = nodeId;
    mesh.mode = primitive.getMode();

    const geometry = new Geometry();

    setAttribute(warehouse, "POSITION", primitive, geometry);
    setAttribute(warehouse, "NORMAL", primitive, geometry);
    setAttribute(warehouse, "TEXCOORD_0", primitive, geometry);
    setAttribute(warehouse, "TEXCOORD_1", primitive, geometry);
    setAttribute(warehouse, "TEXCOORD_2", primitive, geometry);
    setAttribute(warehouse, "TEXCOORD_3", primitive, geometry);
    setAttribute(warehouse, "COLOR_0", primitive, geometry);
    setAttribute(warehouse, "JOINTS_0", primitive, geometry);
    setAttribute(warehouse, "WEIGHTS_0", primitive, geometry);

    const indices = primitive.getIndices()?.getArray();

    if (indices instanceof Uint16Array) {
      const indices32 = Uint32Array.from(indices);
      geometry.indices.write(indices32, warehouse);
    } else if (indices instanceof Uint32Array) {
      geometry.indices.write(indices, warehouse);
    } else {
      geometry.indices.write(new Uint32Array(), warehouse);
    }

    const material = primitive.getMaterial();
    if (material) {
      mesh.materialId = importMaterial(warehouse, material, commands, context);
    }

    context.name.value = gltfMesh.getName() || `Mesh_${context.meshIds.length}`;

    const meshId = commands
      .spawn(true)
      .add(mesh)
      .add(geometry)
      .add(context.name).id;

    context.meshIds.push(meshId);
  });

  context.meshes.set(gltfMesh, nodeId);
}

function setAttribute(
  warehouse: Warehouse,
  name: keyof typeof THREE_TO_ECS_ATTRIBUTES,
  primitive: Primitive,
  geometry: Geometry
) {
  const array = primitive.getAttribute(name)?.getArray();
  const ecsName = THREE_TO_ECS_ATTRIBUTES[name];

  if (array instanceof Float32Array) {
    geometry[ecsName].write(array, warehouse);
  } else {
    geometry[ecsName].write(new Float32Array(), warehouse);
  }
}
