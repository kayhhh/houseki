import { Vec3 } from "@houseki-engine/core";
import { Transform } from "@houseki-engine/scene";
import { Entity, EntityCommands, type f32, struct, type u64 } from "thyseus";

export class TargetTransform extends Transform {}

export class Velocity extends Vec3 {}

@struct
export class BoxCollider {
  size: Vec3;

  constructor(size: Readonly<[number, number, number]> = [1, 1, 1]) {
    this.size = new Vec3(...size);
  }
}

@struct
export class SphereCollider {
  radius: f32;

  constructor(radius = 0.5) {
    this.radius = radius;
  }
}

@struct
export class CapsuleCollider {
  radius: f32;
  height: f32;

  constructor(radius = 0.5, height = 1) {
    this.radius = radius;
    this.height = height;
  }
}

@struct
export class CylinderCollider {
  radius: f32;
  height: f32;

  constructor(radius = 0.5, height = 1) {
    this.radius = radius;
    this.height = height;
  }
}

@struct
export class HullCollider {
  meshId: u64;

  constructor(mesh?: Entity | EntityCommands) {
    this.meshId = mesh?.id ?? 0n;
  }
}

@struct
export class MeshCollider {
  meshId: u64;

  constructor(mesh?: Entity | EntityCommands) {
    this.meshId = mesh?.id ?? 0n;
  }
}

@struct
export class StaticBody {}

@struct
export class KinematicBody {
  mass: f32;
  linearVelocity: Vec3 = new Vec3();
  angularVelocity: Vec3 = new Vec3();

  constructor(mass = 1) {
    this.mass = mass;
  }
}

@struct
export class DynamicBody {
  mass: f32 = 0;
  linearVelocity: Vec3 = new Vec3();
  angularVelocity: Vec3 = new Vec3();

  constructor(mass = 1) {
    this.mass = mass;
  }
}

@struct
export class CharacterController {
  offset: f32;

  maxSlopeClimbAngle: f32;
  minSlopeSlideAngle: f32;

  enableAutostep: boolean;
  maxStepHeight: f32;
  minStepWidth: f32;
  stepOnDynamicBodies: boolean;

  enableSnapToGround: boolean;
  snapToGroundDistance: f32;

  applyImpulsesToDynamicBodies: boolean;

  isGrounded: boolean;

  constructor(offset = 0.02) {
    this.offset = offset;

    this.maxSlopeClimbAngle = (60 * Math.PI) / 180;
    this.minSlopeSlideAngle = (50 * Math.PI) / 180;

    this.enableAutostep = true;
    this.maxStepHeight = 0.3;
    this.minStepWidth = 0.2;
    this.stepOnDynamicBodies = false;

    this.enableSnapToGround = true;
    this.snapToGroundDistance = 0.2;

    this.applyImpulsesToDynamicBodies = true;
    this.isGrounded = false;
  }
}

/**
 * @see https://rapier.rs/docs/user_guides/javascript/scene_queries/#ray-casting
 */
@struct
export class Raycast {
  origin: Vec3 = new Vec3();
  direction: Vec3 = new Vec3();
  maxToi: f32;
  solid: boolean;

  /**
   * Entity ID of a rigid body that should be excluded from the ray cast.
   */
  excludeRigidBodyId: u64 = 0n;

  hit: boolean = false;
  hitToi: f32 = 0;
  hitEntityId: u64 = 0n;
  hitPosition: Vec3 = new Vec3();
  hitNormal: Vec3 = new Vec3();

  constructor(
    origin: Readonly<[number, number, number]> = [0, 0, 0],
    direction: Readonly<[number, number, number]> = [0, 0, 0],
    maxToi = 1000,
    solid = false
  ) {
    this.origin = new Vec3(...origin);
    this.direction = new Vec3(...direction);
    this.maxToi = maxToi;
    this.solid = solid;
  }
}
