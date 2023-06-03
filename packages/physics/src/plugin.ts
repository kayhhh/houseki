import { LatticeSchedules } from "@lattice-engine/core";
import { run, WorldBuilder } from "thyseus";

import { applyTargetTransforms } from "./systems/applyTargetTransforms";
import { createCharacters } from "./systems/characters/createCharacters";
import { moveCharacters } from "./systems/characters/moveCharacters";
import { saveCharacters } from "./systems/characters/saveCharacters";
import { createBoxColliders } from "./systems/colliders/createBoxColliders";
import { createCapsuleColliders } from "./systems/colliders/createCapsuleColliders";
import { createCylinderColliders } from "./systems/colliders/createCylinderColliders";
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
  builder.addSystemsToSchedule(
    LatticeSchedules.FixedUpdate,
    ...run.chain(
      [createDynamicBodies, createKinematicBodies, createStaticBodies],
      [
        createBoxColliders,
        createCapsuleColliders,
        createCylinderColliders,
        createSphereColliders,
      ],
      createCharacters,
      moveCharacters,
      [moveRigidBodies, rotateRigidBodies],
      stepWorld,
      [runRaycasts, saveCharacters, saveRigidBodies, generateDebug]
    )
  );

  builder.addSystems(run(applyTargetTransforms).last());
}
