import { Geometry } from "lattice-engine/scene";
import {
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  PlaneGeometry,
  SphereGeometry,
} from "three";

export function createSphereGeometry(radius = 0.5) {
  const sphere = new SphereGeometry(radius);
  return writeGeometry(sphere);
}

export function createBoxGeometry(
  size: Readonly<[number, number, number]> = [1, 1, 1]
) {
  const box = new BoxGeometry(...size);
  return writeGeometry(box);
}

export function createPlaneGeometry(width = 1, height = 1) {
  const geometry = new PlaneGeometry(width, height);
  return writeGeometry(geometry);
}

function writeGeometry(threeGeometry: BufferGeometry) {
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
  geometry.positions = Array.from(positions);
  geometry.normals = Array.from(normals);
  geometry.uv = Array.from(uvs);

  const indices32 = new Uint32Array(indices.length);

  for (let i = 0; i < indices.length; i++) {
    indices32[i] = indices[i] ?? 0;
  }

  geometry.indices = Array.from(indices32);

  return geometry;
}
