import { Resource, Vec3, Vec4 } from "@lattice-engine/core";
import { Entity, EntityCommands, initStruct, struct } from "thyseus";

import {
  ImageMimeType,
  KeyframeInterpolation,
  KeyframePath,
  MaterialAlphaMode,
} from "./types";

/**
 * An entity must have both a {@link Transform} and a {@link GlobalTransform} component
 * for transforms to work correctly.
 */
@struct
export class Transform {
  @struct.substruct(Vec3) declare translation: Vec3;
  @struct.substruct(Vec4) declare rotation: Vec4;
  @struct.substruct(Vec3) declare scale: Vec3;

  constructor(
    translation: Readonly<[number, number, number]> = [0, 0, 0],
    rotation: Readonly<[number, number, number, number]> = [0, 0, 0, 1],
    scale: Readonly<[number, number, number]> = [1, 1, 1]
  ) {
    initStruct(this);

    this.translation = new Vec3();
    this.rotation = new Vec4();
    this.scale = new Vec3();

    this.translation.fromArray(translation);
    this.rotation.fromArray(rotation);
    this.scale.fromArray(scale);
  }
}

/**
 * GlobalTransform is managed by the engine and should not be modified.
 * To modify the transform of an entity, use the {@link Transform} component.
 */
export class GlobalTransform extends Transform {}

@struct
export class Parent {
  @struct.u64 declare id: bigint;

  constructor(entity?: Readonly<Entity> | EntityCommands) {
    initStruct(this);

    if (entity) this.id = entity.id;
  }
}

@struct
export class Scene {
  @struct.u64 declare skyboxId: bigint;

  constructor(skybox?: Entity | EntityCommands) {
    initStruct(this);

    if (skybox) this.skyboxId = skybox.id;
  }
}

@struct
export class Mesh {
  @struct.u64 declare materialId: bigint; // Entity ID

  constructor(material?: Entity | EntityCommands) {
    initStruct(this);

    if (material) this.materialId = material.id;
  }
}

@struct
export class LineSegments {
  @struct.u64 declare materialId: bigint; // Entity ID

  constructor(material?: Entity | EntityCommands) {
    initStruct(this);

    if (material) this.materialId = material.id;
  }
}

@struct
export class Geometry {
  @struct.substruct(Resource) declare colors: Resource<Float32Array>;
  @struct.substruct(Resource) declare indices: Resource<
    Uint16Array | Uint32Array
  >;
  @struct.substruct(Resource) declare normals: Resource<Float32Array>;
  @struct.substruct(Resource) declare positions: Resource<Float32Array>;
  @struct.substruct(Resource) declare uvs: Resource<Float32Array>;
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

    // TODO: Upgrade thyseus to support this (theres a bug)
    // this.magFilter = 9729;
    // this.minFilter = 9987;
    // this.wrapS = 10497;
    // this.wrapT = 10497;
    // this.texCoord = 0;
    // this.rotation = 0;
    // this.offset.set([0, 0]);
    // this.scale.set([1, 1]);
  }
}

/**
 * An Image can either be a URI or a binary blob.
 */
@struct
export class Image {
  @struct.substruct(Resource) declare data: Resource<Uint8Array>;
  @struct.string declare uri: string;
  @struct.u8 declare mimeType: ImageMimeType;

  constructor(uri = "") {
    initStruct(this);

    this.uri = uri;
  }
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

  constructor(color = [1, 1, 1, 1], metalness = 1, roughness = 1) {
    initStruct(this);

    this.baseColor.set(color);
    this.emissiveFactor.set([0, 0, 0]);
    this.normalScale = 1;
    this.occlusionStrength = 1;
    this.roughness = roughness;
    this.metalness = metalness;
  }
}

@struct
export class LineMaterial {
  @struct.array({ length: 4, type: "f32" }) declare color: Float32Array;
  @struct.bool declare vertexColors: boolean;

  constructor(color = [1, 1, 1, 1]) {
    initStruct(this);

    this.color.set(color);
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
 * Should be attached to an entity in the scene graph.
 *
 * The animation system is heavily based on the Three.js animation system.
 * @see https://threejs.org/docs/#manual/en/introduction/Animation-system
 */
@struct
export class AnimationMixer {}

/**
 * Represents a single animation clip. (e.g. "walk", "run", "idle")
 */
@struct
export class AnimationClip {
  @struct.u64 declare mixerId: bigint; // Entity ID

  @struct.string declare name: string;

  @struct.bool declare play: boolean;

  @struct.bool declare loop: boolean;

  @struct.f32 declare speed: number;

  constructor(mixerId = 0n, name = "", play = false, loop = false, speed = 1) {
    initStruct(this);

    this.mixerId = mixerId;
    this.name = name;
    this.play = play;
    this.loop = loop;
    this.speed = speed;
  }
}

/**
 * Represents an animation keyframe track. (e.g. "position", "rotation", "scale")
 */
@struct
export class KeyframeTrack {
  @struct.u64 declare clipId: bigint; // Entity ID

  @struct.u64 declare targetId: bigint; // Entity ID

  @struct.u8 declare path: KeyframePath;

  @struct.u8 declare interpolation: KeyframeInterpolation;

  @struct.substruct(Resource) declare times: Resource<Float32Array>;

  @struct.substruct(Resource) declare values: Resource<Float32Array>;
}
