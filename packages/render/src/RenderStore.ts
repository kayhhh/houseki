import {
  AnimationClip,
  AnimationMixer,
  BufferGeometry,
  KeyframeTrack,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";

export type EntityID = bigint;

/**
 * Stores Three.js objects and their associated data.
 */
export class RenderStore {
  static DEFAULT_MATERIAL = new MeshStandardMaterial();

  renderer = new WebGLRenderer();

  readonly perspectiveCameras = new Map<EntityID, PerspectiveCamera>();
  readonly scenes = new Map<EntityID, Scene>();
  readonly geometries = new Map<EntityID, BufferGeometry>();
  readonly materials = new Map<EntityID, MeshStandardMaterial>();
  readonly images = new Map<EntityID, ImageBitmap>();
  readonly meshes = new Map<EntityID, Mesh>();
  readonly nodes = new Map<EntityID, Object3D>();
  readonly animationMixers = new Map<EntityID, AnimationMixer>();
  readonly animationClips = new Map<EntityID, AnimationClip>();
  readonly keyframeTracks = new Map<EntityID, KeyframeTrack>();
}
