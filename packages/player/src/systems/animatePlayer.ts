import { InputStruct } from "@lattice-engine/input";
import { CharacterController, Velocity } from "@lattice-engine/physics";
import { Parent } from "@lattice-engine/scene";
import { VrmAnimation } from "@lattice-engine/vrm";
import { Entity, Mut, Query, Res, With } from "thyseus";

import { PlayerAvatar, PlayerBody } from "../components";
import { readInput } from "../utils/readInput";

export function animatePlayer(
  inputStruct: Res<InputStruct>,
  avatars: Query<[Entity, Parent, PlayerAvatar]>,
  animations: Query<[Entity, Mut<VrmAnimation>]>,
  bodies: Query<[Entity, CharacterController, Velocity], With<PlayerBody>>
) {
  const input = readInput(inputStruct);

  const walkWeight = Math.abs(input.x) + Math.abs(input.y);

  for (const [entity, parent, avatar] of avatars) {
    for (const [bodyEntity, character, velocity] of bodies) {
      if (bodyEntity.id !== parent.id) continue;

      for (const [animationEntity, animation] of animations) {
        if (animation.vrmId !== entity.id) continue;

        const jumpWeight = character.isGrounded ? 0 : 1;

        switch (animationEntity.id) {
          case avatar.idleAnimationId: {
            animation.weight = 1 - walkWeight - jumpWeight;
            animation.play = animation.weight > 0;
            break;
          }

          case avatar.walkAnimationId: {
            animation.weight = jumpWeight === 0 ? walkWeight : 0;
            animation.play = animation.weight > 0;
            break;
          }

          case avatar.sprintAnimationId: {
            break;
          }

          case avatar.jumpAnimationId: {
            animation.weight = jumpWeight;
            animation.play = animation.weight > 0;
            break;
          }

          case avatar.leftWalkAnimationId: {
            break;
          }

          case avatar.rightWalkAnimationId: {
            break;
          }
        }
      }
    }
  }
}
