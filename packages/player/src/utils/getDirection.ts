import { Position, Rotation } from "@lattice-engine/scene";
import { Matrix4, Quaternion, Vector3 } from "three";

const quaternion = new Quaternion();
const matrix4 = new Matrix4();
const vector3 = new Vector3();

/**
 * Gets direction vector from a rotation and position.
 * @example
 * const rotation = { x: 0, y: 0, z: 0, w: 1 };
 * const position = { x: 0, y: 0, z: 0 };
 * const direction = getDirection(rotation, position); // Vector3(0, 0, -1)
 */
export function getDirection(rotation: Rotation, position: Position) {
  quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
  matrix4.setPosition(position.x, position.y, position.z);
  matrix4.makeRotationFromQuaternion(quaternion);
  vector3.setFromMatrixColumn(matrix4, 0);
  return vector3;
}
