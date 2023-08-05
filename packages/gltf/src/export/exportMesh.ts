import { GLTF } from "@gltf-transform/core";
import { Geometry, Mesh } from "@lattice-engine/scene";

import { GLTF_TO_ECS_ATTRIBUTES } from "../constants";
import { ExportContext } from "./context";

const ATTRIBUTE_TYPES = {
  colors: "VEC4",
  indices: "SCALAR",
  joints: "VEC4",
  normals: "VEC3",
  positions: "VEC3",
  uv: "VEC2",
  uv1: "VEC2",
  uv2: "VEC2",
  uv3: "VEC2",
  weights: "VEC4",
} as const;

export function exportMesh(
  context: ExportContext,
  entityId: bigint,
  mesh: Mesh,
  geometry: Geometry
) {
  const parentId = mesh.parentId || entityId;
  let gltfMesh = context.meshes.get(parentId);

  if (!gltfMesh) {
    const name = context.names.get(entityId);
    gltfMesh = context.doc.createMesh(name);
    context.meshes.set(parentId, gltfMesh);
  }

  const primitive = context.doc.createPrimitive();
  gltfMesh.addPrimitive(primitive);

  primitive.setMode(mesh.mode as GLTF.MeshPrimitiveMode);

  const materialId = mesh.materialId || entityId;
  const material = context.materials.get(materialId);

  if (material) primitive.setMaterial(material);

  for (const [gltf, ecs] of Object.entries(GLTF_TO_ECS_ATTRIBUTES)) {
    const array = geometry[ecs];
    if (array.length === 0) continue;

    const accessor = context.doc.createAccessor();
    accessor.setArray(new Float32Array(array));
    accessor.setType(ATTRIBUTE_TYPES[ecs]);
    primitive.setAttribute(gltf, accessor);
  }

  const indices = geometry.indices;
  if (indices.length) {
    const accessor = context.doc.createAccessor();
    accessor.setArray(new Uint32Array(indices));
    accessor.setType("SCALAR");
    primitive.setIndices(accessor);
  }
}
