import { InputStruct, Key } from "@lattice-engine/input";
import { CharacterController, Velocity } from "@lattice-engine/physics";
import { Parent, Position, Rotation } from "@lattice-engine/scene";
import { Entity, Mut, Query, Res, With } from "thyseus";

import { PlayerBody, PlayerCamera } from "../components";
import { getDirection } from "../utils/getDirection";
import { readInput } from "../utils/readInput";

const VELOCITY_DAMPEN = 0.15;

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

      const movementX = direction.x * input.x + direction.z * input.y;
      const movementZ = direction.z * input.x - direction.x * input.y;

      const targetX = movementX * player.speed;
      const targetZ = movementZ * player.speed;

      velocity.x = lerp(velocity.x, targetX, VELOCITY_DAMPEN);
      velocity.z = lerp(velocity.z, targetZ, VELOCITY_DAMPEN);

      if (player.enableVoidTeleport && position.y < player.voidLevel) {
        velocity.set(0, 0, 0);
        position.set(
          player.spawnPoint.x,
          player.spawnPoint.y,
          player.spawnPoint.z
        );
      }

      if (jump && character.isGrounded) {
        velocity.y = player.jumpStrength;
      }
    }
  }
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
