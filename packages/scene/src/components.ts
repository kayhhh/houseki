import { Vec2, Vec3, Vec4 } from "@lattice-engine/core";
import {
  Entity,
  EntityCommands,
  type f32,
  struct,
  type u8,
  type u16,
  type u64,
} from "thyseus";

import { MeshMode } from "./types";

export class Quat extends Vec4 {
  constructor(x = 0, y = 0, z = 0, w = 1) {
    super(x, y, z, w);
  }
}

/**
 * An entity must have both a {@link Transform} and a {@link GlobalTransform} component
 * for transforms to work correctly.
 */
@struct
export class Transform {
  translation: Vec3;
  rotation: Quat;
  scale: Vec3;

  constructor(
    translation: Readonly<[number, number, number]> = [0, 0, 0],
    rotation: Readonly<[number, number, number, number]> = [0, 0, 0, 1],
    scale: Readonly<[number, number, number]> = [1, 1, 1]
  ) {
    this.translation = new Vec3(...translation);
    this.rotation = new Quat(...rotation);
    this.scale = new Vec3(...scale);
  }

  set(
    translation?: Readonly<[number, number, number]>,
    rotation?: Readonly<[number, number, number, number]>,
    scale?: Readonly<[number, number, number]>
  ): this {
    if (translation) this.translation.fromArray(translation);
    if (rotation) this.rotation.fromArray(rotation);
    if (scale) this.scale.fromArray(scale);

    return this;
  }

  copy(transform: Readonly<Transform>): this {
    this.translation.copy(transform.translation);
    this.rotation.copy(transform.rotation);
    this.scale.copy(transform.scale);

    return this;
  }
}

/**
 * GlobalTransform is managed by the engine and should not be modified.
 * To modify the transform of an entity, use the {@link Transform} component.
 */
export class GlobalTransform extends Transform {}

@struct
export class Name {
  value: string;

  constructor(value = "") {
    this.value = value;
  }
}

@struct
export class Parent {
  id: u64;

  constructor(id = 0n) {
    this.id = id;
  }

  setEntity(entity: Readonly<Entity> | EntityCommands): this {
    this.id = entity.id;

    return this;
  }

  setId(id: bigint): this {
    this.id = id;

    return this;
  }
}

@struct
export class Scene {
  /**
   * Entity ID of the root node of the scene.
   * Used for scene content (ie. meshes) not temporary runtime things (player, camera, etc).
   * Useful for saving/loading scenes.
   */
  rootId: u64 = 0n;
}

/**
 * Attaches to a scene entity.
 */
@struct
export class Skybox {
  imageId: u64 = 0n;
}

@struct
export class Mesh {
  parentId: u64 = 0n;
  materialId: u64 = 0n;

  mode: u8;
  frustumCulled: boolean;

  constructor(material?: Entity | EntityCommands) {
    this.materialId = material?.id ?? 0n;

    this.mode = MeshMode.TRIANGLES;
    this.frustumCulled = true;
  }
}

@struct
export class Geometry {
  indices: f32[] = [];
  colors: f32[] = [];
  joints: f32[] = [];
  normals: f32[] = [];
  positions: f32[] = [];
  uv1: f32[] = [];
  uv2: f32[] = [];
  uv3: f32[] = [];
  uv: f32[] = [];
  weights: f32[] = [];
}

@struct
export class TextureInfo {
  magFilter: u16 = 9729;
  minFilter: u16 = 9987;
  wrapS: u16 = 10497;
  wrapT: u16 = 10497;
  texCoord: f32 = 0;
  rotation: f32 = 0;
  offset: Vec2 = new Vec2(0, 0);
  scale: Vec2 = new Vec2(1, 1);
}

/**
 * Marks an `Asset` as an image, which will be loaded as a bitmap.
 */
@struct
export class Image {
  flipY: boolean;

  constructor(flipY = false) {
    this.flipY = flipY;
  }
}

@struct
export class StandardMaterial {
  vertexColors = false;

  alphaMode: u8 = 0;
  alphaCutoff: f32 = 0;
  doubleSided = false;

  baseColor: Vec4;
  baseColorTextureId: u64 = 0n; // Entity ID
  baseColorTextureInfo: TextureInfo = new TextureInfo();

  emissiveFactor: Vec3 = new Vec3();
  emissiveTextureId: u64 = 0n; // Entity ID
  emissiveTextureInfo: TextureInfo = new TextureInfo();

  normalScale: f32 = 0;
  normalTextureId: u64 = 0n; // Entity ID
  normalTextureInfo: TextureInfo = new TextureInfo();

  occlusionStrength: f32 = 0;
  occlusionTextureId: u64 = 0n; // Entity ID
  occlusionTextureInfo: TextureInfo = new TextureInfo();

  roughness: f32 = 0;
  metalness: f32 = 0;
  metallicRoughnessTextureId: u64 = 0n; // Entity ID
  metallicRoughnessTextureInfo: TextureInfo = new TextureInfo();

  constructor(
    color: [number, number, number, number] = [1, 1, 1, 1],
    metalness = 1,
    roughness = 1
  ) {
    this.baseColor = new Vec4(...color);
    this.normalScale = 1;
    this.occlusionStrength = 1;
    this.roughness = roughness;
    this.metalness = metalness;
  }
}

@struct
export class BasicMaterial {
  doubleSided = false;
  colorWrite = true;
}

@struct
export class LineMaterial {
  color: [f32, f32, f32, f32];
  vertexColors = false;

  constructor(color = [1, 1, 1, 1]) {
    this.color = [...color] as [f32, f32, f32, f32];
  }
}

@struct
export class PerspectiveCamera {
  fov: f32 = 75;
  near: f32 = 0.1;
  far: f32 = 1000;
}

/**
 * The AnimationMixer is used to apply animations to an object.
 * Should be attached to an entity in the scene graph.
 *
 * The animation system is based on the Three.js animation system.
 * @see https://threejs.org/docs/#manual/en/introduction/Animation-system
 */
@struct
export class AnimationMixer {}

/**
 * Represents an animation clip. (e.g. "walk", "run", "idle")
 */
@struct
export class AnimationClip {
  mixerId: u64; // Entity ID

  name: string;

  play: boolean;

  loop: boolean;

  speed: f32;

  constructor(mixerId = 0n, name = "", play = false, loop = false, speed = 1) {
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
  clipId: u64 = 0n; // Entity ID
  targetId: u64 = 0n; // Entity ID
  path: u8 = 0;
  interpolation: u8 = 0;
  times: f32[] = [];
  values: f32[] = [];
}

@struct
export class AmbientLight {
  color: [f32, f32, f32];
  intensity: f32;

  constructor(color = [1, 1, 1], intensity = 1) {
    this.color = [...color] as [f32, f32, f32];
    this.intensity = intensity;
  }
}

@struct
export class DirectionalLight {
  color: [f32, f32, f32];
  intensity: f32;

  constructor(color = [1, 1, 1], intensity = 1) {
    this.color = [...color] as [f32, f32, f32];
    this.intensity = intensity;
  }
}

@struct
export class ShadowMap {
  mapSize: u16;
  bias: f32;

  left: f32;
  right: f32;
  top: f32;
  bottom: f32;
  near: f32;
  far: f32;

  constructor(
    mapSize = 2048,
    left = -5,
    right = 5,
    top = 5,
    bottom = -5,
    near = 0.1,
    far = 1000,
    bias = -0.0001
  ) {
    this.mapSize = mapSize;
    this.left = left;
    this.right = right;
    this.top = top;
    this.bottom = bottom;
    this.near = near;
    this.far = far;
    this.bias = bias;
  }
}
