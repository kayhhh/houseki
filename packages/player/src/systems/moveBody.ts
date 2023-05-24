import { InputStruct, Key } from "@lattice-engine/input";
import { CharacterController, Velocity } from "@lattice-engine/physics";
import { Parent, Position, Rotation } from "@lattice-engine/scene";
import { Matrix4, Quaternion, Vector3 } from "three";
import { Entity, Mut, Query, Res, With } from "thyseus";

import { PlayerBody, PlayerCamera } from "../components";
import { readInput } from "../utils/readInput";

const quaternion = new Quaternion();
const matrix4 = new Matrix4();
const vector3 = new Vector3();

/**
 * System that moves the player body.
 */
export function moveBody(
  inputStruct: Res<InputStruct>,
  cameras: Query<[Parent, Rotation], With<PlayerCamera>>,
  bodies: Query<
    [Entity, PlayerBody, CharacterController, Mut<Position>, Mut<Velocity>]
  >
) {
  const input = readInput(inputStruct);
  const jump = inputStruct.keyPressed(Key.Space);

  for (const [parent, rotation] of cameras) {
    for (const [entity, player, character, position, velocity] of bodies) {
      // Find the body that matches the camera parent
      if (entity.id !== parent.id) continue;

      // Get direction vector
      quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
      matrix4.setPosition(position.x, position.y, position.z);
      matrix4.makeRotationFromQuaternion(quaternion);
      vector3.setFromMatrixColumn(matrix4, 0);

      // Apply input to velocity, using the direction
      velocity.x = vector3.x * input.x + vector3.z * input.y;
      velocity.z = vector3.z * input.x - vector3.x * input.y;

      velocity.x *= player.speed;
      velocity.z *= player.speed;

      if (player.enableVoidTeleport && position.y < player.voidLevel) {
        velocity.set(0, 0, 0);
        position.set(...player.spawnPoint.value);
      }

      if (jump && character.isGrounded) {
        velocity.y = player.jumpStrength;
      }
    }
  }
}
