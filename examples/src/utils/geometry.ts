import { Warehouse } from "lattice-engine/core";
import { Geometry } from "lattice-engine/scene";
import { BoxGeometry, BufferAttribute, SphereGeometry } from "three";

/**
 * Creates a sphere geometry, using Three.js to generate the data.
 */
export function createSphereGeometry(
  warehouse: Readonly<Warehouse>,
  radius = 0.5
) {
  const sphere = new SphereGeometry(radius);

  const positionsAttribute = sphere.getAttribute("position") as BufferAttribute;
  const normalsAttribute = sphere.getAttribute("normal") as BufferAttribute;
  const uvsAttribute = sphere.getAttribute("uv") as BufferAttribute;
  const indicesAttribute = sphere.index as BufferAttribute;

  const positions = positionsAttribute.array as Float32Array;
  const normals = normalsAttribute.array as Float32Array;
  const uvs = uvsAttribute.array as Float32Array;
  const indices = indicesAttribute.array as Uint16Array;

  const geometry = new Geometry();
  geometry.positions.write(positions, warehouse);
  geometry.normals.write(normals, warehouse);
  geometry.uvs.write(uvs, warehouse);
  geometry.indices.write(indices, warehouse);

  return geometry;
}

/**
 * Creates a box geometry, using Three.js to generate the data.
 */
export function createBoxGeometry(
  warehouse: Readonly<Warehouse>,
  size: Readonly<[number, number, number]> = [1, 1, 1]
) {
  const box = new BoxGeometry(...size);

  const positionsAttribute = box.getAttribute("position") as BufferAttribute;
  const normalsAttribute = box.getAttribute("normal") as BufferAttribute;
  const uvsAttribute = box.getAttribute("uv") as BufferAttribute;
  const indicesAttribute = box.index as BufferAttribute;

  const positions = positionsAttribute.array as Float32Array;
  const normals = normalsAttribute.array as Float32Array;
  const uvs = uvsAttribute.array as Float32Array;
  const indices = indicesAttribute.array as Uint16Array;

  const geometry = new Geometry();
  geometry.positions.write(positions, warehouse);
  geometry.normals.write(normals, warehouse);
  geometry.uvs.write(uvs, warehouse);
  geometry.indices.write(indices, warehouse);

  return geometry;
}
