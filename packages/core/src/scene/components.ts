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
export class Mesh {
  @struct.u64 declare material: bigint; // Entity ID
}

@struct
export class Geometry {
  @struct.substruct(Resource) declare positions: Resource<Float32Array>;
  @struct.substruct(Resource) declare normals: Resource<Float32Array>;
  @struct.substruct(Resource) declare uvs: Resource<Float32Array>;
  @struct.substruct(Resource) declare indices: Resource<Uint16Array>;
}

@struct
export class TextureInfo {
  @struct.u16 declare magFilter: number;
  @struct.u16 declare minFilter: number;
  @struct.u16 declare wrapS: number;
  @struct.u16 declare wrapT: number;
  @struct.f32 declare texCoord: number;
  @struct.f32 declare rotation: number;
  @struct.array({ length: 2, type: "f32" }) declare offset: Float32Array;
  @struct.array({ length: 2, type: "f32" }) declare scale: Float32Array;
}

@struct
export class Texture {
  @struct.substruct(Resource) declare image: Resource<Uint8Array>;
  @struct.u8 declare mimeType: number; // ImageMimeType
}

@struct
export class Material {
  @struct.u8 declare alphaMode: number; // MaterialAlphaMode
  @struct.f32 declare alphaCutOff: number;
  @struct.bool declare doubleSided: boolean;

  @struct.array({ length: 4, type: "f32" }) declare baseColor: Float32Array;
  @struct.substruct(Texture) declare baseColorTexture: Texture;
  @struct.substruct(TextureInfo) declare baseColorTextureInfo: TextureInfo;

  @struct.array({ length: 3, type: "f32" })
  declare emissiveFactor: Float32Array;
  @struct.substruct(Texture) declare emissiveTexture: Texture;
  @struct.substruct(TextureInfo) declare emissiveTextureInfo: TextureInfo;

  @struct.f32 declare normalScale: number;
  @struct.substruct(Texture) declare normalTexture: Texture;
  @struct.substruct(TextureInfo) declare normalTextureInfo: TextureInfo;

  @struct.f32 declare occlusionStrength: number;
  @struct.substruct(Texture) declare occlusionTexture: Texture;
  @struct.substruct(TextureInfo) declare occlusionTextureInfo: TextureInfo;

  @struct.f32 declare roughness: number;
  @struct.f32 declare metalness: number;
  @struct.substruct(Texture) declare metallicRoughnessTexture: Texture;
  @struct.substruct(TextureInfo)
  declare metallicRoughnessTextureInfo: TextureInfo;
}

@struct
export class PerspectiveCamera {
  @struct.f32 declare fov: number;
  @struct.f32 declare near: number;
  @struct.f32 declare far: number;
}