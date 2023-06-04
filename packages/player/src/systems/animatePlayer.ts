import { Time } from "@lattice-engine/core";
import { Velocity } from "@lattice-engine/physics";
import { Parent } from "@lattice-engine/scene";
import { VrmAnimation } from "@lattice-engine/vrm";
import { Entity, Mut, Query, Res } from "thyseus";

import { PlayerAvatar, PlayerBody } from "../components";

const WALK_SPEED = 5;
const SPRINT_SPEED = 5;
const JUMP_SPEED = 5;
const FALL_THRESHOLD_SECONDS = 0.35;

export function animatePlayer(
  time: Res<Time>,
  avatars: Query<[Entity, Parent, PlayerAvatar]>,
  animations: Query<[Entity, Mut<VrmAnimation>]>,
  bodies: Query<[Entity, PlayerBody, Velocity]>
) {
  for (const [entity, parent, avatar] of avatars) {
    for (const [bodyEntity, player, velocity] of bodies) {
      if (bodyEntity.id !== parent.id) continue;

      const isFalling = player.airTime > FALL_THRESHOLD_SECONDS;
      const isJumping = player.jumpTime > 0 && player.airTime !== 0;
      const showFallAnimation = isFalling || isJumping;

      const moveLength = Math.sqrt(
        Math.abs(velocity.x) ** 2 + Math.abs(velocity.z) ** 2
      );
      const isSprinting = moveLength > player.speed * 1.05;
      const isWalking = moveLength / player.speed > 0.25 && !isSprinting;

      let totalWeight = 0;

      for (const [animationEntity, animation] of animations) {
        if (animation.vrmId !== entity.id) continue;
        if (animationEntity.id === avatar.idleAnimationId) continue;

        switch (animationEntity.id) {
          case avatar.walkAnimationId: {
            const change =
              isWalking && !showFallAnimation ? WALK_SPEED : -WALK_SPEED;
            animation.weight += time.mainDelta * change;
            break;
          }

          case avatar.sprintAnimationId: {
            const change =
              isSprinting && !showFallAnimation ? SPRINT_SPEED : -SPRINT_SPEED;
            animation.weight = clamp(
              animation.weight + time.mainDelta * change
            );
            break;
          }

          case avatar.jumpAnimationId: {
            const change = showFallAnimation ? JUMP_SPEED : -JUMP_SPEED;
            animation.weight += time.mainDelta * change;
            break;
          }

          case avatar.leftWalkAnimationId: {
            animation.weight = 0;
            break;
          }

          case avatar.rightWalkAnimationId: {
            animation.weight = 0;
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
