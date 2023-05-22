import { InputStruct, Key } from "@lattice-engine/input";
import { CharacterController, Velocity } from "@lattice-engine/physics";
import { Position, Rotation } from "@lattice-engine/scene";
import { Matrix4, Quaternion, Vector2, Vector3 } from "three";
import { Mut, Query, Res } from "thyseus";

import { PlayerControls } from "./components";

const quaternion = new Quaternion();
const matrix4 = new Matrix4();
const vector3 = new Vector3();
const vector2 = new Vector2();

export function movePlayer(
  inputStruct: Res<InputStruct>,
  entities: Query<
    [
      PlayerControls,
      CharacterController,
      Mut<Position>,
      Rotation,
      Mut<Velocity>
    ]
  >
) {
  const up =
    inputStruct.keyPressed(Key.w) || inputStruct.keyPressed(Key.ArrowUp);
  const down =
    inputStruct.keyPressed(Key.s) || inputStruct.keyPressed(Key.ArrowDown);
  const left =
    inputStruct.keyPressed(Key.a) || inputStruct.keyPressed(Key.ArrowLeft);
  const right =
    inputStruct.keyPressed(Key.d) || inputStruct.keyPressed(Key.ArrowRight);
  const jump = inputStruct.keyPressed(Key.Space);

  for (const [player, character, position, rotation, velocity] of entities) {
    // Get direction vector
    quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
    matrix4.setPosition(position.x, position.y, position.z);
    matrix4.makeRotationFromQuaternion(quaternion);
    vector3.setFromMatrixColumn(matrix4, 0);

    // Apply input to velocity
    const inputForward = Number(up) - Number(down);
    const inputRight = Number(right) - Number(left);

    const input = vector2
      .set(inputForward, inputRight)
      .multiplyScalar(2)
      .normalize()
      .multiplyScalar(player.speed);

    velocity.x = vector3.x * input.y + vector3.z * input.x;
    velocity.z = vector3.z * input.y - vector3.x * input.x;

    // Teleport out of void
    if (player.enableVoidTeleport && position.y < player.voidLevel) {
      velocity.set(0, 0, 0);
      position.set(...player.spawnPoint.array());
    }

    if (jump && character.isGrounded) {
      velocity.y = player.jumpStrength;
    }
  }
}
