import { Warehouse } from "@lattice-engine/core";
import { Geometry } from "@lattice-engine/scene";
import { BufferAttribute, BufferGeometry, PlaneGeometry } from "three";

export function createPlaneGeometry(
  warehouse: Readonly<Warehouse>,
  width = 1,
  height = 1,
) {
  const geometry = new PlaneGeometry(width, height);
  return writeGeometry(geometry, warehouse);
}

function writeGeometry(
  threeGeometry: BufferGeometry,
  warehouse: Readonly<Warehouse>,
) {
  const positionsAttribute = threeGeometry.getAttribute(
    "position",
  ) as BufferAttribute;
  const normalsAttribute = threeGeometry.getAttribute(
    "normal",
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
