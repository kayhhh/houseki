import { InputStruct, Key } from "@lattice-engine/input";
import { Position, Rotation } from "@lattice-engine/scene";
import { Matrix4, Quaternion, Vector3 } from "three";
import { Mut, Query, Res, With } from "thyseus";

import { PlayerControls } from "./components";

const SPEED = 0.04;

const matrix4 = new Matrix4();
const quaternion = new Quaternion();
const vector3 = new Vector3();

export function movePlayer(
  inputStruct: Res<InputStruct>,
  entities: Query<[Mut<Position>, Rotation], With<PlayerControls>>
) {
  const w =
    inputStruct.keyPressed(Key.w) || inputStruct.keyPressed(Key.ArrowUp);
  const s =
    inputStruct.keyPressed(Key.s) || inputStruct.keyPressed(Key.ArrowDown);
  const a =
    inputStruct.keyPressed(Key.a) || inputStruct.keyPressed(Key.ArrowLeft);
  const d =
    inputStruct.keyPressed(Key.d) || inputStruct.keyPressed(Key.ArrowRight);

  for (const [position, rotation] of entities) {
    quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
    matrix4.setPosition(position.x, position.y, position.z);
    matrix4.makeRotationFromQuaternion(quaternion);
    vector3.setFromMatrixColumn(matrix4, 0);

    const forward = Number(w) - Number(s);
    const right = Number(d) - Number(a);

    const x = forward * SPEED;
    const z = right * SPEED;

    position.x += vector3.x * z + vector3.z * x;
    position.z += vector3.z * z - vector3.x * x;
  }
}
