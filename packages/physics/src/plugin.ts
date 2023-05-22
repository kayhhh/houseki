import { CoreSchedule, run, WorldBuilder } from "thyseus";

import { createCharacters } from "./systems/characters/createCharacters";
import { moveCharacters } from "./systems/characters/moveCharacters";
import { createBoxColliders } from "./systems/colliders/createBoxColliders";
import { createCapsuleColliders } from "./systems/colliders/createCapsuleColliders";
import { createCylinderColliders } from "./systems/colliders/createCylinderColliders";
import { createSphereColliders } from "./systems/colliders/createSphereColliders";
import { createDynamicBodies } from "./systems/rigidbodies/createDynamicBodies";
import { createKinematicBodies } from "./systems/rigidbodies/createKinematicBodies";
import { createStaticBodies } from "./systems/rigidbodies/createStaticBodies";
import { moveRigidBodies } from "./systems/rigidbodies/moveRigidBodies";
import { rotateRigidBodies } from "./systems/rigidbodies/rotateRigidBodies";
import { saveRigidBodies } from "./systems/rigidbodies/saveRigidBodies";
import { stepWorld } from "./systems/stepWorld";

export function physicsPlugin(builder: WorldBuilder) {
  builder.addSystemsToSchedule(
    CoreSchedule.FixedUpdate,
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
      saveRigidBodies
    )
  );
}
