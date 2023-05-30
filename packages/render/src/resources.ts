import {
  AnimationClip,
  AnimationMixer,
  BufferGeometry,
  KeyframeTrack,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import { struct } from "thyseus";

export type EntityID = bigint;

export class RenderStore {
  static DEFAULT_MATERIAL = new MeshStandardMaterial();

  renderer = new WebGLRenderer();

  readonly perspectiveCameras = new Map<EntityID, PerspectiveCamera>();
  readonly scenes = new Map<EntityID, Scene>();
  readonly geometries = new Map<EntityID, BufferGeometry>();
  readonly materials = new Map<EntityID, MeshStandardMaterial>();
  readonly lineMaterials = new Map<EntityID, LineBasicMaterial>();
  readonly images = new Map<EntityID, ImageBitmap>();
  readonly meshes = new Map<EntityID, Mesh>();
  readonly lineSegments = new Map<EntityID, LineSegments>();
  readonly nodes = new Map<EntityID, Object3D>();
  readonly animationMixers = new Map<EntityID, AnimationMixer>();
  readonly animationClips = new Map<EntityID, AnimationClip>();
  readonly keyframeTracks = new Map<EntityID, KeyframeTrack>();
}

@struct
export class RenderStats {
  @struct.u32 declare frame: number;
  @struct.u32 declare calls: number;
  @struct.u32 declare lines: number;
  @struct.u32 declare points: number;
  @struct.u32 declare triangles: number;
  @struct.u32 declare geometries: number;
  @struct.u32 declare textures: number;
  @struct.u32 declare shaders: number;
}
