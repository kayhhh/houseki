import { Geometry, Warehouse } from "@lattice-engine/core";
import { BufferAttribute, SphereGeometry } from "three";

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
