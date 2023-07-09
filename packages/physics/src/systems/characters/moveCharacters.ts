import { Entity, Mut, Query, Res, With } from "thyseus";

import { CharacterController, Velocity } from "../../components";
import { PhysicsStore } from "../../resources";

export function moveCharacters(
  physicsStore: Res<PhysicsStore>,
  bodies: Query<[Entity, Mut<Velocity>], With<CharacterController>>,
) {
  const delta = physicsStore.world.timestep;

  for (const [entity, velocity] of bodies) {
    const controller = physicsStore.characterControllers.get(entity.id);
    const collider = physicsStore.getCollider(entity.id);
    const rigidbody = physicsStore.getRigidBody(entity.id);
    if (!controller || !collider || !rigidbody) continue;

    // Apply gravity to velocity
    const newVelocity = {
      x: velocity.x + physicsStore.world.gravity.x * delta,
      y: velocity.y + physicsStore.world.gravity.y * delta,
      z: velocity.z + physicsStore.world.gravity.z * delta,
    };

    // Use velocity to compute desired translation
    const desiredTranslation = {
      x: newVelocity.x * delta,
      y: newVelocity.y * delta,
      z: newVelocity.z * delta,
    };

    // Compute movement
    controller.computeColliderMovement(collider, desiredTranslation);
    const movement = controller.computedMovement();

    // Apply movement
    velocity.x = movement.x / delta;
    velocity.y = movement.y / delta;
    velocity.z = movement.z / delta;
  }
}
