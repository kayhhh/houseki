import { Time } from "@lattice-engine/core";
import { Velocity } from "@lattice-engine/physics";
import { Parent, Transform } from "@lattice-engine/scene";
import { VrmAnimation } from "@lattice-engine/vrm";
import { Entity, Mut, Query, Res } from "thyseus";

import { PlayerAvatar, PlayerBody } from "../components";
import { getDirection } from "../utils/getDirection";

const WALK_SPEED = 5;
const SPRINT_SPEED = 5;
const JUMP_SPEED = 5;
const FALL_THRESHOLD_SECONDS = 0.35;

export function animatePlayer(
  time: Res<Time>,
  avatars: Query<[Entity, Parent, PlayerAvatar]>,
  animations: Query<[Entity, Mut<VrmAnimation>]>,
  bodies: Query<[Entity, PlayerBody, Velocity, Transform]>
) {
  for (const [entity, parent, avatar] of avatars) {
    for (const [bodyEntity, player, velocity, transform] of bodies) {
      if (bodyEntity.id !== parent.id) continue;
      const isFalling = player.airTime > FALL_THRESHOLD_SECONDS;
      const isJumping = player.jumpTime > 0 && player.airTime !== 0;

      const moveLength = Math.sqrt(
        Math.abs(velocity.x) ** 2 + Math.abs(velocity.z) ** 2
      );
      const isSprinting = moveLength > player.speed * 1.05;
      const isWalking = moveLength / player.speed > 0.25 && !isSprinting;

      const showFallAnimation = isFalling || isJumping;
      const showSprintAnimation = isSprinting && !showFallAnimation;
      const showWalkAnimation = isWalking && !showFallAnimation;

      const direction = getDirection(transform.rotation);

      const movementRight =
        (direction.x * velocity.x + direction.z * velocity.z) / player.speed;
      const movementForward =
        (direction.z * velocity.x - direction.x * velocity.z) / player.speed;

      const movingZ = Math.abs(movementForward) > 0.1;

      let totalWeight = 0;

      for (const [animationEntity, animation] of animations) {
        if (animation.vrmId !== entity.id) continue;
        if (animationEntity.id === avatar.idleAnimationId) continue;

        switch (animationEntity.id) {
          case avatar.jumpAnimationId: {
            const change = showFallAnimation ? 1 : -1;
            animation.weight += time.mainDelta * JUMP_SPEED * change;
            break;
          }

          case avatar.sprintAnimationId: {
            const change = showSprintAnimation ? 1 : -1;
            animation.speed = movementForward > 0 ? 1 : -1;
            animation.weight += time.mainDelta * SPRINT_SPEED * change;
            break;
          }

          case avatar.walkAnimationId: {
            const change = showWalkAnimation ? Math.abs(movementForward) : -1;
            animation.speed = movementForward > 0 ? 1 : -1;
            animation.weight += time.mainDelta * WALK_SPEED * change;
            break;
          }

          case avatar.leftWalkAnimationId: {
            const change = !movingZ && showWalkAnimation ? -movementRight : -1;
            animation.weight += time.mainDelta * WALK_SPEED * change;
            break;
          }

          case avatar.rightWalkAnimationId: {
            const change = !movingZ && showWalkAnimation ? movementRight : -1;
            animation.weight += time.mainDelta * WALK_SPEED * change;
            break;
          }
        }

        animation.weight = clamp(animation.weight);
        animation.play = animation.weight > 0;

        totalWeight += animation.weight;
      }

      // Idle animation
      for (const [animationEntity, animation] of animations) {
        if (animation.vrmId !== entity.id) continue;
        if (animationEntity.id !== avatar.idleAnimationId) continue;

        animation.weight = clamp(1 - totalWeight);
        animation.play = animation.weight > 0;
      }
    }
  }
}

function clamp(value: number, min = 0, max = 1) {
  return Math.max(Math.min(value, max), min);
}
