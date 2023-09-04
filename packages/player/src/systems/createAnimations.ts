import { VrmAnimation } from "@lattice-engine/vrm";
import { Commands, Entity, Mut, Query } from "thyseus";

import { PlayerAvatar } from "../components";

export function createAnimations(
  commands: Commands,
  avatars: Query<[Entity, Mut<PlayerAvatar>]>,
  animations: Query<[Entity, Mut<VrmAnimation>]>
) {
  const ids: bigint[] = [];

  // Create VrmAnimations
  for (const [entity, avatar] of avatars) {
    ids.push(entity.id);

    let idleAnimation: VrmAnimation | undefined = undefined;
    let walkAnimation: VrmAnimation | undefined = undefined;
    let sprintAnimation: VrmAnimation | undefined = undefined;
    let jumpAnimation: VrmAnimation | undefined = undefined;
    let leftWalkAnimation: VrmAnimation | undefined = undefined;
    let rightWalkAnimation: VrmAnimation | undefined = undefined;

    for (const [animationEntity, animation] of animations) {
      if (animation.vrmId !== entity.id) continue;

      switch (animationEntity.id) {
        case avatar.idleAnimationId: {
          idleAnimation = animation;
          break;
        }

        case avatar.walkAnimationId: {
          walkAnimation = animation;
          break;
        }

        case avatar.sprintAnimationId: {
          sprintAnimation = animation;
          break;
        }

        case avatar.jumpAnimationId: {
          jumpAnimation = animation;
          break;
        }

        case avatar.leftWalkAnimationId: {
          leftWalkAnimation = animation;
          break;
        }

        case avatar.rightWalkAnimationId: {
          rightWalkAnimation = animation;
          break;
        }
      }
    }

    avatar.idleAnimationId = createAnimation(
      commands,
      idleAnimation,
      entity.id,
      avatar.idleAnimationId,
      avatar.idleAnimation
    );

    avatar.walkAnimationId = createAnimation(
      commands,
      walkAnimation,
      entity.id,
      avatar.walkAnimationId,
      avatar.walkAnimation
    );

    avatar.sprintAnimationId = createAnimation(
      commands,
      sprintAnimation,
      entity.id,
      avatar.sprintAnimationId,
      avatar.sprintAnimation
    );

    avatar.jumpAnimationId = createAnimation(
      commands,
      jumpAnimation,
      entity.id,
      avatar.jumpAnimationId,
      avatar.jumpAnimation
    );

    avatar.leftWalkAnimationId = createAnimation(
      commands,
      leftWalkAnimation,
      entity.id,
      avatar.leftWalkAnimationId,
      avatar.leftWalkAnimation
    );

    avatar.rightWalkAnimationId = createAnimation(
      commands,
      rightWalkAnimation,
      entity.id,
      avatar.rightWalkAnimationId,
      avatar.rightWalkAnimation
    );
  }

  // Remove VrmAnimations on player removal
  for (const [entity, animation] of animations) {
    if (!ids.includes(animation.vrmId)) {
      commands.despawnById(entity.id);
    }
  }
}

function createAnimation(
  commands: Commands,
  animation: VrmAnimation | undefined,
  vrmId: bigint,
  animationId: bigint,
  uri: string
) {
  if (animation) {
    animation.vrmId = vrmId;
    animation.uri = uri;

    return animationId;
  } else {
    const vrmAnimation = new VrmAnimation(vrmId, uri, false, true);

    const entityId = commands.spawn(true).add(vrmAnimation).id;

    return entityId;
  }
}
