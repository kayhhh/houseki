import { Warehouse } from "@lattice-engine/core";
import { Geometry, Mesh } from "@lattice-engine/scene";

import { ExportContext } from "./context";

export function exportMesh(
  context: ExportContext,
  warehouse: Readonly<Warehouse>,
  entityId: bigint,
  mesh: Mesh,
  geometry: Geometry
) {
  const gltfMesh = context.doc.createMesh();

  const primitive = context.doc.createPrimitive();
  gltfMesh.addPrimitive(primitive);

  primitive.setMode(mesh.mode);

  const materialId = mesh.materialId || entityId;
  const material = context.materials.get(materialId);

  if (material) primitive.setMaterial(material);

  const positions = geometry.positions.read(warehouse);
  if (positions) {
    const accessor = context.doc.createAccessor();
    accessor.setArray(positions);
    accessor.setType("VEC3");
    primitive.setAttribute("POSITION", accessor);
  }

  const normals = geometry.normals.read(warehouse);
  if (normals) {
    const accessor = context.doc.createAccessor();
    accessor.setArray(normals);
    accessor.setType("VEC3");
    primitive.setAttribute("NORMAL", accessor);
  }

  const uvs = geometry.uvs.read(warehouse);
  if (uvs) {
    const accessor = context.doc.createAccessor();
    accessor.setArray(uvs);
    accessor.setType("VEC2");
    primitive.setAttribute("TEXCOORD_0", accessor);
  }

  const indices = geometry.indices.read(warehouse);
  if (indices) {
    const accessor = context.doc.createAccessor();
    accessor.setArray(indices);
    accessor.setType("SCALAR");
    primitive.setIndices(accessor);
  }

  const parentId = mesh.parentId || entityId;
  context.meshes.set(parentId, gltfMesh);
}
