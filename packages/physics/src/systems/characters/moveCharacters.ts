import { Position } from "@lattice-engine/scene";
import { Entity, Query, Res, With } from "thyseus";

import { CharacterController } from "../../components";
import { PhysicsStore } from "../../PhysicsStore";

/**
 * Moves all character controllers according to their position component.
 * Entity must have a collider, rigidbody is optional.
 */
export function moveCharacters(
  physicsStore: Res<PhysicsStore>,
  bodies: Query<[Entity, Position], With<CharacterController>>
) {
  for (const [entity, position] of bodies) {
    const controller = physicsStore.characterControllers.get(entity.id);
    const collider = physicsStore.getCollider(entity.id);
    const rigidbody = physicsStore.getRigidBody(entity.id);
    if (!controller || !collider || !rigidbody) continue;

    // TODO: Use real delta time
    const delta = 1 / 60;

    // Compute change in position since last frame
    const currentPosition = rigidbody.translation();
    const deltaPosition = {
      x: position.x - currentPosition.x,
      y: position.y - currentPosition.y,
      z: position.z - currentPosition.z,
    };

    // Apply gravity
    deltaPosition.x += physicsStore.world.gravity.x * delta;
    deltaPosition.y += physicsStore.world.gravity.y * delta;
    deltaPosition.z += physicsStore.world.gravity.z * delta;

    // Compute movement
    controller.computeColliderMovement(collider, deltaPosition);

    // Apply movement
    const movement = controller.computedMovement();

    const newPos = {
      x: position.x + movement.x,
      y: position.y + movement.y,
      z: position.z + movement.z,
    };

    rigidbody.setNextKinematicTranslation(newPos);
  }
}
