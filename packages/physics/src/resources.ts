import {
  Collider,
  KinematicCharacterController,
  RigidBody,
  World,
} from "@dimforge/rapier3d";
import { struct } from "thyseus";

export class PhysicsStore {
  readonly world = new World({ x: 0, y: -9.81, z: 0 });

  /**
   * Entity ID -> Rapier collider
   */
  readonly boxColliders = new Map<bigint, Collider>();
  readonly sphereColliders = new Map<bigint, Collider>();
  readonly capsuleColliders = new Map<bigint, Collider>();
  readonly cylinderColliders = new Map<bigint, Collider>();
  readonly hullColliders = new Map<bigint, Collider>();
  readonly meshColliders = new Map<bigint, Collider>();

  /**
   * Entity ID -> Rapier rigidbody
   */
  readonly staticBodies = new Map<bigint, RigidBody>();
  readonly kinematicBodies = new Map<bigint, RigidBody>();
  readonly dynamicBodies = new Map<bigint, RigidBody>();

  /**
   * Entity ID -> Rapier Character Controller
   */
  readonly characterControllers = new Map<
    bigint,
    KinematicCharacterController
  >();

  /**
   * Returns the Rapier rigidbody for the given entity ID.
   */
  getRigidBody(id: bigint) {
    return (
      this.staticBodies.get(id) ??
      this.kinematicBodies.get(id) ??
      this.dynamicBodies.get(id)
    );
  }

  /**
   * Returns the Rapier collider for the given entity ID.
   */
  getCollider(id: bigint) {
    return (
      this.boxColliders.get(id) ??
      this.sphereColliders.get(id) ??
      this.capsuleColliders.get(id) ??
      this.cylinderColliders.get(id) ??
      this.hullColliders.get(id) ??
      this.meshColliders.get(id)
    );
  }
}

@struct
export class PhysicsConfig {
  @struct.bool declare debug: boolean;
}
