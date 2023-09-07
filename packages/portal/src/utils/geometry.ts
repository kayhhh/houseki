import { Warehouse } from "@reddo/core";
import { Geometry } from "@reddo/scene";
import { BufferAttribute, BufferGeometry, PlaneGeometry } from "three";

export function createPlaneGeometry(
  warehouse: Warehouse,
  width = 1,
  height = 1
) {
  const geometry = new PlaneGeometry(width, height);
  return writeGeometry(warehouse, geometry);
}

function writeGeometry(warehouse: Warehouse, threeGeometry: BufferGeometry) {
  const positionsAttribute = threeGeometry.getAttribute(
    "position"
  ) as BufferAttribute;
  const normalsAttribute = threeGeometry.getAttribute(
    "normal"
  ) as BufferAttribute;
  const uvsAttribute = threeGeometry.getAttribute("uv") as BufferAttribute;
  const indicesAttribute = threeGeometry.index as BufferAttribute;

  const positions = positionsAttribute.array as Float32Array;
  const normals = normalsAttribute.array as Float32Array;
  const uvs = uvsAttribute.array as Float32Array;
  const indices = indicesAttribute.array as Uint16Array;

  const geometry = new Geometry();
  geometry.positions.write(positions, warehouse);
  geometry.normals.write(normals, warehouse);
  geometry.uv.write(uvs, warehouse);

  const indices32 = new Uint32Array(indices.length);

  for (let i = 0; i < indices.length; i++) {
    indices32[i] = indices[i] ?? 0;
  }

  geometry.indices.write(indices32, warehouse);

  return geometry;
}
