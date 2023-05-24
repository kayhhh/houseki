import { InputStruct, Key } from "@lattice-engine/input";
import { CharacterController, Velocity } from "@lattice-engine/physics";
import { Parent, Position, Rotation } from "@lattice-engine/scene";
import { Entity, Mut, Query, Res, With } from "thyseus";

import { PlayerBody, PlayerCamera } from "../components";
import { getDirection } from "../utils/getDirection";
import { readInput } from "../utils/readInput";

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

      const direction = getDirection(rotation, position);

      velocity.x = direction.x * input.x + direction.z * input.y;
      velocity.z = direction.z * input.x - direction.x * input.y;

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
