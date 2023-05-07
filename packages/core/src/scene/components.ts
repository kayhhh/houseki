import { struct } from "thyseus";

import { Resource } from "../warehouse/components";

@struct
export class Position {
  @struct.f32 declare x: number;
  @struct.f32 declare y: number;
  @struct.f32 declare z: number;
}

@struct
export class Rotation {
  @struct.f32 declare x: number;
  @struct.f32 declare y: number;
  @struct.f32 declare z: number;
  @struct.f32 declare w: number;
}

@struct
export class Scale {
  @struct.f32 declare x: number;
  @struct.f32 declare y: number;
  @struct.f32 declare z: number;
}

@struct
export class Parent {
  @struct.u64 declare id: bigint;
}

@struct
export class IsScene {}

@struct
export class IsNode {}

@struct
export class IsMesh {}

@struct
export class Geometry {
  @struct.u64 declare id: number;
  @struct.substruct(Resource) declare positions: Resource<Float32Array>;
  @struct.substruct(Resource) declare normals: Resource<Float32Array>;
  @struct.substruct(Resource) declare uvs: Resource<Float32Array>;
  @struct.substruct(Resource) declare indices: Resource<Uint16Array>;
}

@struct
export class Material {}

@struct
export class PerspectiveCamera {
  @struct.f32 declare fov: number;
  @struct.f32 declare near: number;
  @struct.f32 declare far: number;
}
