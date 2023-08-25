import { Warehouse } from "@lattice-engine/core";
import { VrmAnimation } from "@lattice-engine/vrm";
import { Commands, dropStruct, Entity, Mut, Query } from "thyseus";

import { PlayerAvatar } from "../components";

export function createAnimations(
  commands: Commands,
  warehouse: Warehouse,
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

    const idleAnimationUri = avatar.idleAnimation.read(warehouse) ?? "";
    avatar.idleAnimationId = createAnimation(
      commands,
      warehouse,
      idleAnimation,
      entity.id,
      avatar.idleAnimationId,
      idleAnimationUri
    );

    const walkAnimationUri = avatar.walkAnimation.read(warehouse) ?? "";
    avatar.walkAnimationId = createAnimation(
      commands,
      warehouse,
      walkAnimation,
      entity.id,
      avatar.walkAnimationId,
      walkAnimationUri
    );

    const sprintAnimationUri = avatar.sprintAnimation.read(warehouse) ?? "";
    avatar.sprintAnimationId = createAnimation(
      commands,
      warehouse,
      sprintAnimation,
      entity.id,
      avatar.sprintAnimationId,
      sprintAnimationUri
    );

    const jumpAnimationUri = avatar.jumpAnimation.read(warehouse) ?? "";
    avatar.jumpAnimationId = createAnimation(
      commands,
      warehouse,
      jumpAnimation,
      entity.id,
      avatar.jumpAnimationId,
      jumpAnimationUri
    );

    const leftWalkAnimationUri = avatar.leftWalkAnimation.read(warehouse) ?? "";
    avatar.leftWalkAnimationId = createAnimation(
      commands,
      warehouse,
      leftWalkAnimation,
      entity.id,
      avatar.leftWalkAnimationId,
      leftWalkAnimationUri
    );

    const rightWalkAnimationUri =
      avatar.rightWalkAnimation.read(warehouse) ?? "";
    avatar.rightWalkAnimationId = createAnimation(
      commands,
      warehouse,
      rightWalkAnimation,
      entity.id,
      avatar.rightWalkAnimationId,
      rightWalkAnimationUri
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
  warehouse: Warehouse,
  animation: VrmAnimation | undefined,
  vrmId: bigint,
  animationId: bigint,
  uri: string
) {
  if (animation) {
    animation.vrmId = vrmId;
    animation.uri.write(uri, warehouse);

    return animationId;
  } else {
    const vrmAnimation = new VrmAnimation(vrmId, false, true);
    vrmAnimation.uri.write(uri, warehouse);

    const entityId = commands.spawn(true).add(vrmAnimation).id;
    dropStruct(vrmAnimation);

    return entityId;
  }
}
