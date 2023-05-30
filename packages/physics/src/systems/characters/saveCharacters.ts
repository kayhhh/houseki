import { Entity, Mut, Query, Res } from "thyseus";

import { CharacterController } from "../../components";
import { PhysicsStore } from "../../resources";

export function saveCharacters(
  physicsStore: Res<PhysicsStore>,
  characters: Query<[Entity, Mut<CharacterController>]>
) {
  for (const [entity, character] of characters) {
    const object = physicsStore.characterControllers.get(entity.id);
    if (!object) continue;

    character.isGrounded = object.computedGrounded();
  }
}
