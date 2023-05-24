import { Resource } from "@lattice-engine/core";
import { Entity, EntityCommands, initStruct, struct } from "thyseus";

import { AnimationPath, ImageMimeType, MaterialAlphaMode } from "./types";

@struct
export class Position {
  @struct.f32 declare x: number;
  @struct.f32 declare y: number;
  @struct.f32 declare z: number;

  constructor(x = 0, y = 0, z = 0) {
    initStruct(this);

    this.x = x;
    this.y = y;
    this.z = z;
  }

  set(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

@struct
export class Rotation {
  @struct.f32 declare x: number;
  @struct.f32 declare y: number;
  @struct.f32 declare z: number;
  @struct.f32 declare w: number;

  constructor(x = 0, y = 0, z = 0, w = 1) {
    initStruct(this);

    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  set(x: number, y: number, z: number, w: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }
}

@struct
export class Scale {
  @struct.f32 declare x: number;
  @struct.f32 declare y: number;
  @struct.f32 declare z: number;

  constructor(x = 1, y = 1, z = 1) {
    initStruct(this);

    this.x = x;
    this.y = y;
    this.z = z;
  }
}

@struct
export class Parent {
  @struct.u64 declare id: bigint;

  constructor(entity?: Readonly<Entity> | EntityCommands) {
    initStruct(this);

    if (entity) this.id = entity.id;
  }
}

@struct
export class Scene {}

@struct
export class Node {}

@struct
export class Mesh {
  @struct.u64 declare materialId: bigint; // Entity ID

  constructor(material?: Entity | EntityCommands) {
    initStruct(this);

    if (material) this.materialId = material.id;
  }
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

  constructor() {
    initStruct(this);

    this.magFilter = 9729;
    this.minFilter = 9987;
    this.wrapS = 10497;
    this.wrapT = 10497;
    this.texCoord = 0;
    this.rotation = 0;
    this.offset.set([0, 0]);
    this.scale.set([1, 1]);
  }
}

@struct
export class Texture {
  @struct.substruct(Resource) declare image: Resource<Uint8Array>;
  @struct.u8 declare mimeType: ImageMimeType;
}

@struct
export class Material {
  @struct.u8 declare alphaMode: MaterialAlphaMode;
  @struct.f32 declare alphaCutOff: number;
  @struct.bool declare doubleSided: boolean;

  @struct.array({ length: 4, type: "f32" }) declare baseColor: Float32Array;
  @struct.u64 declare baseColorTextureId: bigint; // Entity ID
  @struct.substruct(TextureInfo) declare baseColorTextureInfo: TextureInfo;

  @struct.array({ length: 3, type: "f32" })
  declare emissiveFactor: Float32Array;
  @struct.u64 declare emissiveTextureId: bigint; // Entity ID
  @struct.substruct(TextureInfo) declare emissiveTextureInfo: TextureInfo;

  @struct.f32 declare normalScale: number;
  @struct.u64 declare normalTextureId: bigint; // Entity ID
  @struct.substruct(TextureInfo) declare normalTextureInfo: TextureInfo;

  @struct.f32 declare occlusionStrength: number;
  @struct.u64 declare occlusionTextureId: bigint; // Entity ID
  @struct.substruct(TextureInfo) declare occlusionTextureInfo: TextureInfo;

  @struct.f32 declare roughness: number;
  @struct.f32 declare metalness: number;
  @struct.u64 declare metallicRoughnessTextureId: bigint; // Entity ID
  @struct.substruct(TextureInfo)
  declare metallicRoughnessTextureInfo: TextureInfo;

  constructor(color = [1, 1, 1, 1]) {
    initStruct(this);

    this.baseColor = new Float32Array(color);
  }
}

@struct
export class PerspectiveCamera {
  @struct.f32 declare fov: number;
  @struct.f32 declare near: number;
  @struct.f32 declare far: number;

  constructor() {
    initStruct(this);

    this.fov = 75;
    this.near = 0.1;
    this.far = 1000;
  }
}

/**
 * The AnimationMixer is used to apply animations to an object.
 * Should be attached to a Node entity.
 *
 * The animation system is heavily based on the Three.js animation system.
 * @see https://threejs.org/docs/#manual/en/introduction/Animation-system
 */
@struct
export class AnimationMixer {}

/**
 * Represents a single animation clip. (e.g. "walk", "run", "idle")
 * Should be parented to an AnimationMixer.
 */
@struct
export class AnimationClip {
  @struct.string declare name: string;

  @struct.bool declare play: boolean;

  @struct.bool declare loop: boolean;

  @struct.f32 declare speed: number;

  constructor(name = "", play = false, loop = false, speed = 1) {
    initStruct(this);

    this.name = name;
    this.play = play;
    this.loop = loop;
    this.speed = speed;
  }
}

/**
 * Represents a single animation keyframe track. (e.g. "position", "rotation", "scale")
 * Should be parented to an AnimationClip.
 */
@struct
export class KeyframeTrack {
  @struct.u64 declare targetId: bigint; // Entity ID

  @struct.u8 declare path: AnimationPath;

  @struct.substruct(Resource) declare times: Resource<Float32Array>;

  @struct.substruct(Resource) declare values: Resource<Float32Array>;
}
