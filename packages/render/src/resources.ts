import { EffectComposer } from "postprocessing";
import {
  AmbientLight,
  AnimationClip,
  AnimationMixer,
  BufferGeometry,
  DirectionalLight,
  KeyframeTrack,
  Line,
  LineBasicMaterial,
  LineLoop,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  Points,
  Scene,
  WebGLRenderer,
} from "three";
import { struct } from "thyseus";

export type EntityID = bigint;

export type MeshLike = Mesh | LineSegments | Line | LineLoop | Points;

export class RenderStore {
  static DEFAULT_MATERIAL = new MeshStandardMaterial();

  renderer = new WebGLRenderer();
  composer = new EffectComposer(this.renderer);

  readonly perspectiveCameras = new Map<EntityID, PerspectiveCamera>();
  readonly scenes = new Map<EntityID, Scene>();
  readonly geometries = new Map<EntityID, BufferGeometry>();
  readonly basicMaterials = new Map<EntityID, MeshBasicMaterial>();
  readonly standardMaterials = new Map<EntityID, MeshStandardMaterial>();
  readonly lineMaterials = new Map<EntityID, LineBasicMaterial>();
  readonly images = new Map<EntityID, ImageBitmap>();
  readonly meshes = new Map<EntityID, MeshLike>();
  readonly nodes = new Map<EntityID, Object3D>();
  readonly animationMixers = new Map<EntityID, AnimationMixer>();
  readonly animationClips = new Map<EntityID, AnimationClip>();
  readonly keyframeTracks = new Map<EntityID, KeyframeTrack>();
  readonly ambientLights = new Map<EntityID, AmbientLight>();
  readonly directionalLights = new Map<EntityID, DirectionalLight>();

  getMaterial(id: EntityID) {
    return (
      this.standardMaterials.get(id) ??
      this.basicMaterials.get(id) ??
      this.lineMaterials.get(id)
    );
  }
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
