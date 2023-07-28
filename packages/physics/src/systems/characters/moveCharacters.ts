import { Time } from "@lattice-engine/core";
import { Entity, Mut, Query, Res, With } from "thyseus";

import { CharacterController, Velocity } from "../../components";
import { PhysicsStore } from "../../resources";

const desiredTranslation = {
  x: 0,
  y: 0,
  z: 0,
};

export function moveCharacters(
  time: Res<Time>,
  physicsStore: Res<PhysicsStore>,
  bodies: Query<[Entity, Mut<Velocity>], With<CharacterController>>,
) {
  const delta = time.fixedDelta;

  for (const [entity, velocity] of bodies) {
    const controller = physicsStore.characterControllers.get(entity.id);
    const collider = physicsStore.getCollider(entity.id);
    const rigidbody = physicsStore.getRigidBody(entity.id);
    if (!controller || !collider || !rigidbody) continue;

    // Apply gravity to velocity
    velocity.x += physicsStore.world.gravity.x * delta;
    velocity.y += physicsStore.world.gravity.y * delta;
    velocity.z += physicsStore.world.gravity.z * delta;

    // Calculate desired translation over delta time
    desiredTranslation.x = velocity.x * delta;
    desiredTranslation.y = velocity.y * delta;
    desiredTranslation.z = velocity.z * delta;

    // Compute actual translation
    controller.computeColliderMovement(collider, desiredTranslation);
    const correctedTranslation = controller.computedMovement();

    // Modify velocity to match corrected translation
    velocity.x = correctedTranslation.x / delta;
    velocity.y = correctedTranslation.y / delta;
    velocity.z = correctedTranslation.z / delta;
  }
}
