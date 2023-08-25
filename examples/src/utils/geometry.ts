import { Warehouse } from "lattice-engine/core";
import { Geometry } from "lattice-engine/scene";
import {
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  PlaneGeometry,
  SphereGeometry,
} from "three";

export function createSphereGeometry(warehouse: Warehouse, radius = 0.5) {
  const sphere = new SphereGeometry(radius);
  return writeGeometry(sphere, warehouse);
}

export function createBoxGeometry(
  warehouse: Warehouse,
  size: Readonly<[number, number, number]> = [1, 1, 1]
) {
  const box = new BoxGeometry(...size);
  return writeGeometry(box, warehouse);
}

export function createPlaneGeometry(
  warehouse: Warehouse,
  width = 1,
  height = 1
) {
  const geometry = new PlaneGeometry(width, height);
  return writeGeometry(geometry, warehouse);
}

function writeGeometry(threeGeometry: BufferGeometry, warehouse: Warehouse) {
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
