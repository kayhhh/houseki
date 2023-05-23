import { InputStruct, Key } from "@lattice-engine/input";
import { CharacterController, Velocity } from "@lattice-engine/physics";
import { Parent, Position, Rotation } from "@lattice-engine/scene";
import { Matrix4, Quaternion, Vector2, Vector3 } from "three";
import { Entity, Mut, Query, Res } from "thyseus";

import { PlayerBody, PlayerCamera } from "./components";

const quaternion = new Quaternion();
const matrix4 = new Matrix4();
const vector3 = new Vector3();
const vector2 = new Vector2();

/**
 * System that moves the player body.
 */
export function moveBody(
  inputStruct: Res<InputStruct>,
  cameras: Query<[PlayerCamera, Parent, Rotation]>,
  bodies: Query<
    [Entity, PlayerBody, CharacterController, Mut<Position>, Mut<Velocity>]
  >
) {
  const input = readInput(inputStruct);

  for (const [camera, parent, rotation] of cameras) {
    for (const [entity, player, character, position, velocity] of bodies) {
      // Find the body that matches the camera parent
      if (parent.id !== entity.id) continue;

      // Get direction vector
      quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
      matrix4.setPosition(position.x, position.y, position.z);
      matrix4.makeRotationFromQuaternion(quaternion);
      vector3.setFromMatrixColumn(matrix4, 0);

      // Apply input to velocity
      velocity.x = vector3.x * input.x + vector3.z * input.y;
      velocity.z = vector3.z * input.x - vector3.x * input.y;

      // Apply speed
      velocity.x *= player.speed;
      velocity.z *= player.speed;

      // Teleport out of void
      if (player.enableVoidTeleport && position.y < player.voidLevel) {
        velocity.set(0, 0, 0);
        position.set(...player.spawnPoint.value);
      }

      // Jump
      if (input.jump && character.isGrounded) {
        velocity.y = player.jumpStrength;
      }
    }
  }
}

type Input = {
  jump: boolean;
  x: number;
  y: number;
};

/**
 * Reads and normalizes input.
 */
function readInput(inputStruct: InputStruct): Input {
  const up =
    inputStruct.keyPressed(Key.w) || inputStruct.keyPressed(Key.ArrowUp);
  const down =
    inputStruct.keyPressed(Key.s) || inputStruct.keyPressed(Key.ArrowDown);
  const left =
    inputStruct.keyPressed(Key.a) || inputStruct.keyPressed(Key.ArrowLeft);
  const right =
    inputStruct.keyPressed(Key.d) || inputStruct.keyPressed(Key.ArrowRight);
  const jump = inputStruct.keyPressed(Key.Space);

  const inputForward = Number(up) - Number(down);
  const inputRight = Number(right) - Number(left);

  const input = vector2
    .set(inputRight, inputForward)
    .multiplyScalar(2)
    .normalize();

  return { jump, x: input.x, y: input.y };
}
