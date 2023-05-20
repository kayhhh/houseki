import { Position } from "@lattice-engine/scene";
import {
  Entity,
  Query,
  QueryDescriptor,
  Res,
  ResourceDescriptor,
  With,
  WithDescriptor,
} from "thyseus";

import { CharacterController } from "../../components";
import { PhysicsStore } from "../../PhysicsStore";

/**
 * Moves all character controllers according to their position component.
 * Entity must have a collider, rigidbody is optional.
 */
export function moveCharacters(
  store: Res<PhysicsStore>,
  bodies: Query<[Entity, Position], With<CharacterController>>
) {
  for (const [entity, position] of bodies) {
    const controller = store.characterControllers.get(entity.id);
    const collider = store.getCollider(entity.id);
    if (!controller || !collider) continue;

    const rigidbody = store.getRigidBody(entity.id);

    const currentPos = rigidbody
      ? rigidbody.translation()
      : collider.translation();

    // Compute movement
    const translation = {
      x: position.x - currentPos.x,
      y: position.y - currentPos.y,
      z: position.z - currentPos.z,
    };
    controller.computeColliderMovement(collider, translation);

    // Apply movement
    const newPos = controller.computedMovement();
    if (rigidbody) rigidbody.setNextKinematicTranslation(newPos);
    else collider.setTranslation(newPos);
  }
}

moveCharacters.parameters = [
  ResourceDescriptor(PhysicsStore),
  QueryDescriptor([Entity, Position], WithDescriptor(CharacterController)),
];
