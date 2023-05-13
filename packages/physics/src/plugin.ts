import { CoreSchedule, run, WorldBuilder } from "thyseus";

import { createBoxColliders } from "./systems/colliders/createBoxColliders";
import { createCapsuleColliders } from "./systems/colliders/createCapsuleColliders";
import { createCylinderColliders } from "./systems/colliders/createCylinderColliders";
import { createSphereColliders } from "./systems/colliders/createSphereColliders";
import { createDynamicBodies } from "./systems/rigidbodies/createDynamicBodies";
import { createKinematicBodies } from "./systems/rigidbodies/createKinematicBodies";
import { createStaticBodies } from "./systems/rigidbodies/createStaticBodies";
import { moveRigidBodies } from "./systems/rigidbodies/moveRigidBodies";
import { rotateRigidBodies } from "./systems/rigidbodies/rotateRigidBodies";
import { saveRigidBodyPositions } from "./systems/rigidbodies/saveRigidBodyPositions";
import { stepWorld } from "./systems/stepWorld";

const createRigidBodies = [
  createDynamicBodies,
  createKinematicBodies,
  createStaticBodies,
];

const createColliders = [
  createBoxColliders,
  createCapsuleColliders,
  createCylinderColliders,
  createSphereColliders,
];

const transformRigidBodies = [moveRigidBodies, rotateRigidBodies];

const saveRigidBodies = [saveRigidBodyPositions];

export function physicsPlugin(builder: WorldBuilder) {
  builder.addSystemsToSchedule(
    CoreSchedule.FixedUpdate,
    ...createRigidBodies,
    ...createColliders.map((fn) => run(fn).after(...createRigidBodies)),
    ...transformRigidBodies.map((fn) => run(fn).after(...createColliders)),
    run(stepWorld).after(...transformRigidBodies),
    ...saveRigidBodies.map((fn) => run(fn).after(stepWorld))
  );
}
