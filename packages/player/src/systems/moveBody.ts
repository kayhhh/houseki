import { Time } from "@houseki-engine/core";
import { InputStruct, Key } from "@houseki-engine/input";
import {
  CharacterController,
  TargetTransform,
  Velocity,
} from "@houseki-engine/physics";
import { GlobalTransform, Transform } from "@houseki-engine/scene";
import { lerp } from "three/src/math/MathUtils";
import { Entity, Mut, Query, Res } from "thyseus";

import { PlayerBody, PlayerCamera } from "../components";
import { getDirection } from "../utils/getDirection";
import { readInput } from "../utils/readInput";

const VELOCITY_DAMPEN = 0.15;
const SPRINT_MULTIPLIER = 1.5;
const JUMP_TIME = 0.6;

export function moveBody(
  time: Res<Time>,
  inputStruct: Res<InputStruct>,
  cameras: Query<[PlayerCamera, Transform]>,
  bodies: Query<
    [
      Entity,
      Mut<PlayerBody>,
      CharacterController,
      Mut<Transform>,
      Mut<TargetTransform>,
      Mut<GlobalTransform>,
      Mut<Velocity>
    ]
  >
) {
  const input = readInput(inputStruct);
  const jump = inputStruct.keyPressed(Key.Space);
  const sprint = inputStruct.keyPressed(Key.Shift);

  for (const [camera, cameraTransform] of cameras) {
    for (const [
      entity,
      player,
      character,
      transform,
      targetTransform,
      globalTransform,
      velocity,
    ] of bodies) {
      // Find the body that matches the camera
      if (entity.id !== camera.bodyId) continue;

      const direction = getDirection(
        cameraTransform.rotation,
        targetTransform.translation
      );

      const movementX = direction.x * input.x + direction.z * input.y;
      const movementZ = direction.z * input.x - direction.x * input.y;

      let speed = player.speed;

      if (sprint) {
        speed *= SPRINT_MULTIPLIER;
      }

      const targetX = movementX * speed;
      const targetZ = movementZ * speed;

      velocity.x = lerp(velocity.x, targetX, VELOCITY_DAMPEN);
      velocity.z = lerp(velocity.z, targetZ, VELOCITY_DAMPEN);

      if (
        player.enableVoidTeleport &&
        targetTransform.translation.y < player.voidLevel
      ) {
        velocity.set(0, 0, 0);
        transform.translation.copy(player.spawnPoint);
        targetTransform.translation.copy(player.spawnPoint);
        globalTransform.translation.copy(player.spawnPoint);
      }

      if (jump && character.isGrounded) {
        player.jumpTime = JUMP_TIME;
      }

      if (player.jumpTime > 0) {
        velocity.y = player.jumpStrength * (player.jumpTime / JUMP_TIME);
        player.jumpTime -= time.fixedDelta;
        player.jumpTime = Math.max(player.jumpTime, 0);
      }
    }
  }
}
