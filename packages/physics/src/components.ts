import { Entity, EntityCommands, initStruct, struct } from "thyseus";

@struct
export class BoxCollider {
  @struct.array({ length: 3, type: "f32" }) declare size: [
    number,
    number,
    number
  ];

  constructor(size: Readonly<[number, number, number]> = [1, 1, 1]) {
    initStruct(this);

    this.size[0] = size[0];
    this.size[1] = size[1];
    this.size[2] = size[2];
  }
}

@struct
export class SphereCollider {
  @struct.f32 declare radius: number;

  constructor(radius = 1) {
    initStruct(this);

    this.radius = radius;
  }
}

@struct
export class CapsuleCollider {
  @struct.f32 declare radius: number;
  @struct.f32 declare height: number;

  constructor(radius = 1, height = 1) {
    initStruct(this);

    this.radius = radius;
    this.height = height;
  }
}

@struct
export class CylinderCollider {
  @struct.f32 declare radius: number;
  @struct.f32 declare height: number;

  constructor(radius = 1, height = 1) {
    initStruct(this);

    this.radius = radius;
    this.height = height;
  }
}

@struct
export class HullCollider {
  @struct.u64 declare meshId: bigint;

  constructor(mesh?: Entity | EntityCommands) {
    initStruct(this);

    if (mesh) this.meshId = mesh.id;
  }
}

@struct
export class MeshCollider {
  @struct.u64 declare meshId: bigint;

  constructor(mesh?: Entity | EntityCommands) {
    initStruct(this);

    if (mesh) this.meshId = mesh.id;
  }
}

@struct
export class StaticBody {}

@struct
export class KinematicBody {}

@struct
export class DynamicBody {}

@struct
export class CharacterController {
  @struct.f32 declare offset: number;

  @struct.f32 declare maxSlopeClimbAngle: number;
  @struct.f32 declare minSlopeSlideAngle: number;

  @struct.bool declare enableAutostep: boolean;
  @struct.f32 declare maxStepHeight: number;
  @struct.f32 declare minStepWidth: number;
  @struct.bool declare stepOnDynamicBodies: boolean;

  @struct.bool declare enableSnapToGround: boolean;
  @struct.f32 declare snapToGroundDistance: number;

  constructor(offset = 0.01) {
    initStruct(this);

    this.offset = offset;

    this.maxSlopeClimbAngle = (45 * Math.PI) / 180;
    this.minSlopeSlideAngle = (30 * Math.PI) / 180;

    this.enableAutostep = true;
    this.maxStepHeight = 0.5;
    this.minStepWidth = 0.2;
    this.stepOnDynamicBodies = false;

    this.enableSnapToGround = true;
    this.snapToGroundDistance = 0.5;
  }
}
