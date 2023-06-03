import { InputStruct, Key } from "@lattice-engine/input";
import {
  CharacterController,
  PhysicsStore,
  Velocity,
} from "@lattice-engine/physics";
import { Parent, Transform } from "@lattice-engine/scene";
import { Entity, Mut, Query, Res, With } from "thyseus";

import { PlayerBody, PlayerCamera } from "../components";
import { getDirection } from "../utils/getDirection";
import { lerp } from "../utils/lerp";
import { readInput } from "../utils/readInput";

const VELOCITY_DAMPEN = 0.15;
const SPRINT_MULTIPLIER = 1.5;
const JUMP_TIME = 1.25;

export function moveBody(
  physicsStore: Res<PhysicsStore>,
  inputStruct: Res<InputStruct>,
  cameras: Query<[Parent, Transform], With<PlayerCamera>>,
  bodies: Query<
    [
      Entity,
      Mut<PlayerBody>,
      CharacterController,
      Mut<Transform>,
      Mut<Velocity>
    ]
  >
) {
  const input = readInput(inputStruct);
  const jump = inputStruct.keyPressed(Key.Space);
  const sprint = inputStruct.keyPressed(Key.Shift);

  for (const [parent, cameraTransform] of cameras) {
    for (const [entity, player, character, transform, velocity] of bodies) {
      // Find the body that matches the camera parent
      if (entity.id !== parent.id) continue;

      const direction = getDirection(
        cameraTransform.rotation,
        transform.translation
      );

      const movementX = direction.x * input.x + direction.z * input.y;
      const movementZ = direction.z * input.x - direction.x * input.y;

      const speed = sprint ? player.speed * SPRINT_MULTIPLIER : player.speed;

      const targetX = movementX * speed;
      const targetZ = movementZ * speed;

      velocity.x = lerp(velocity.x, targetX, VELOCITY_DAMPEN);
      velocity.z = lerp(velocity.z, targetZ, VELOCITY_DAMPEN);

      if (
        player.enableVoidTeleport &&
        transform.translation.y < player.voidLevel
      ) {
        velocity.set(0, 0, 0);
        transform.translation.copy(player.spawnPoint);
      }

      if (jump && character.isGrounded) {
        player.jumpTime = JUMP_TIME;
      }

      if (player.jumpTime > 0) {
        velocity.y = player.jumpStrength * (player.jumpTime / JUMP_TIME);
        player.jumpTime -= physicsStore.world.timestep;
      }
    }
  }
}
