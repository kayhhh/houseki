import { initStruct, struct } from "thyseus";

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
}

@struct
export class MeshCollider {
  @struct.u64 declare meshId: bigint;
}

@struct
export class IsStaticBody {}

@struct
export class IsKinematicBody {}

@struct
export class IsDynamicBody {}
