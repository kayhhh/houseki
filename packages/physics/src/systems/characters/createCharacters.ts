import { Entity, Query, Res } from "thyseus";

import { CharacterController } from "../../components";
import { PhysicsStore } from "../../PhysicsStore";

export function createCharacters(
  store: Res<PhysicsStore>,
  characters: Query<[Entity, CharacterController]>
) {
  const ids: bigint[] = [];

  for (const [entity, character] of characters) {
    ids.push(entity.id);

    let object = store.characterControllers.get(entity.id);

    if (!object) {
      // Create new character controllers
      object = store.world.createCharacterController(character.offset);
      store.characterControllers.set(entity.id, object);
    }

    // Sync properties
    object.setOffset(character.offset);

    object.setMaxSlopeClimbAngle(character.maxSlopeClimbAngle);
    object.setMinSlopeSlideAngle(character.minSlopeSlideAngle);

    if (character.enableAutostep) {
      object.enableAutostep(
        character.maxStepHeight,
        character.minStepWidth,
        character.stepOnDynamicBodies
      );
    } else {
      object.disableAutostep();
    }

    if (character.enableSnapToGround) {
      object.enableSnapToGround(character.snapToGroundDistance);
    } else {
      object.disableSnapToGround();
    }

    object.setApplyImpulsesToDynamicBodies(
      character.applyImpulsesToDynamicBodies
    );
  }

  // Remove characters that are no longer in use
  for (const id of store.characterControllers.keys()) {
    if (!ids.includes(id)) {
      const object = store.characterControllers.get(id);
      if (object) store.world.removeCharacterController(object);

      store.characterControllers.delete(id);
    }
  }
}
