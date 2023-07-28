import { LatticeSchedules } from "@lattice-engine/core";
import { updateGlobalTransforms } from "@lattice-engine/scene";
import { run, WorldBuilder } from "thyseus";

import { applyTargetTransforms } from "./systems/applyTargetTransforms";
import { createCharacters } from "./systems/characters/createCharacters";
import { moveCharacters } from "./systems/characters/moveCharacters";
import { saveCharacters } from "./systems/characters/saveCharacters";
import { createBoxColliders } from "./systems/colliders/createBoxColliders";
import { createCapsuleColliders } from "./systems/colliders/createCapsuleColliders";
import { createCylinderColliders } from "./systems/colliders/createCylinderColliders";
import { createHullColliders } from "./systems/colliders/createHullColliders";
import { createMeshColliders } from "./systems/colliders/createMeshColliders";
import { createSphereColliders } from "./systems/colliders/createSphereColliders";
import { generateDebug } from "./systems/generateDebug";
import { createDynamicBodies } from "./systems/rigidbodies/createDynamicBodies";
import { createKinematicBodies } from "./systems/rigidbodies/createKinematicBodies";
import { createStaticBodies } from "./systems/rigidbodies/createStaticBodies";
import { moveRigidBodies } from "./systems/rigidbodies/moveRigidBodies";
import { rotateRigidBodies } from "./systems/rigidbodies/rotateRigidBodies";
import { saveRigidBodies } from "./systems/rigidbodies/saveRigidBodies";
import { runRaycasts } from "./systems/runRaycasts";
import { stepWorld } from "./systems/stepWorld";

export function physicsPlugin(builder: WorldBuilder) {
  builder
    .addSystemsToSchedule(
      LatticeSchedules.FixedUpdate,
      ...run.chain(
        [createDynamicBodies, createKinematicBodies, createStaticBodies],
        [
          createBoxColliders,
          createCapsuleColliders,
          createCylinderColliders,
          createSphereColliders,
          createMeshColliders,
          createHullColliders,
        ],
        createCharacters,
        moveCharacters,
        [moveRigidBodies, rotateRigidBodies],
        stepWorld,
        [runRaycasts, saveCharacters, saveRigidBodies, generateDebug]
      )
    )
    .addSystemsToSchedule(
      LatticeSchedules.PreUpdate,
      run(applyTargetTransforms).before(updateGlobalTransforms)
    );
}
